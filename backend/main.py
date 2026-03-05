from fastapi import FastAPI, Form, HTTPException
import pymysql
import os
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, time as dt_time

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- SMART DB CONNECTION (Local + TiDB Cloud) ---
def get_db():
    is_render = os.environ.get('RENDER') # Check if running on Render
    
    if is_render:
        # TiDB Cloud Connection
        return pymysql.connect(
            host="gateway01.ap-southeast-1.prod.aws.tidbcloud.com",
            user="bbcnrmpTQxBSUUz.root",
            password="H1kbOJeUjXLbr7Ef",
            database="test",
            port=4000,
            ssl_verify_cert=True,
            cursorclass=pymysql.cursors.DictCursor
        )
    else:
        # Localhost Connection
        return pymysql.connect(
            host="localhost",
            user="root",
            password="root", 
            database="lawdb",
            cursorclass=pymysql.cursors.DictCursor
        )

# ---------------- LOGIN ----------------
@app.post("/login")
def login(username: str = Form(...), password: str = Form(...)):
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "SELECT * FROM admin WHERE username=%s AND password=%s",
        (username, password)
    )
    result = cursor.fetchone()
    db.close()
    return {"success": result is not None}

# ---------------- BLOG ----------------
@app.post("/add-blog")
def add_blog(title: str = Form(...), content: str = Form(...)):
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO blogs(title,content) VALUES(%s,%s)",
        (title, content)
    )
    db.commit()
    db.close()
    return {"msg": "Blog added"}

@app.get("/blogs")
def blogs():
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT * FROM blogs ORDER BY id DESC")
    data = cursor.fetchall()
    db.close()
    return data

@app.delete("/delete-blog/{id}")
def delete_blog(id: int):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("DELETE FROM blogs WHERE id=%s", (id,))
    db.commit()
    db.close()
    return {"msg": "Deleted"}

# ---------------- SERVICES ----------------
@app.post("/add-service")
def add_service(title: str = Form(...), description: str = Form(...)):
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO services(title,description) VALUES(%s,%s)",
        (title, description)
    )
    db.commit()
    db.close()
    return {"msg": "Service added"}

@app.get("/services")
def services():
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT * FROM services")
    data = cursor.fetchall()
    db.close()
    return data

@app.delete("/delete-service/{id}")
def delete_service(id: int):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("DELETE FROM services WHERE id=%s", (id,))
    db.commit()
    db.close()
    return {"msg": "Deleted"}

# ---------------- APPOINTMENTS ----------------
@app.post("/book")
def book(
    name: str = Form(...),
    phone: str = Form(...),
    date: str = Form(...),
    time: str = Form(...),
):
    if len(phone) != 10 or not phone.isdigit():
        raise HTTPException(400, "Phone must be 10 digits")

    try:
        new_appt = datetime.strptime(f"{date} {time}", "%Y-%m-%d %H:%M")
    except:
        raise HTTPException(400, "Invalid date/time format")

    if new_appt < datetime.now():
        raise HTTPException(400, "Cannot book past time")

    if new_appt.time() < dt_time(10, 0) or new_appt.time() > dt_time(18, 0):
        raise HTTPException(400, "Booking allowed 10AM–6PM only")

    db = get_db()
    cursor = db.cursor()

    cursor.execute("SELECT date,time FROM appointments WHERE date=%s", (date,))
    existing = cursor.fetchall()

    for e in existing:
        try:
            # pymysql returns timedelta for time objects
            existing_time = str(e["time"])[:5]
            existing_dt = datetime.strptime(f"{e['date']} {existing_time}", "%Y-%m-%d %H:%M")
            diff = abs((new_appt - existing_dt).total_seconds()) / 60
            if diff < 30:
                db.close()
                return {"status": "fail", "message": "This time already booked"}
        except:
            continue

    clean_time = new_appt.strftime("%H:%M:%S")
    cursor.execute(
        "INSERT INTO appointments(name,phone,date,time,status) VALUES(%s,%s,%s,%s,%s)",
        (name, phone, date, clean_time, "pending")
    )
    db.commit()
    db.close()
    return {"status": "success", "msg": "Booked"}

@app.get("/appointments")
def appointments():
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT * FROM appointments ORDER BY id DESC")
    data = cursor.fetchall()
    db.close()

    for d in data:
        if d["time"]:
            # Formatting time for display
            t = str(d["time"])[:5]
            hh, mm = map(int, t.split(":"))
            ampm = "PM" if hh >= 12 else "AM"
            hh = hh % 12 or 12
            d["time"] = f"{hh}:{mm:02d} {ampm}"

        if d.get("fee") is not None and d.get("gst") is not None:
            d["total"] = float(d["fee"]) + (float(d["fee"]) * float(d["gst"]) / 100)
        else:
            d["total"] = 0
    return data

@app.put("/appointments/{id}/complete")
def complete(id: int):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("UPDATE appointments SET status='completed' WHERE id=%s", (id,))
    db.commit()
    db.close()
    return {"msg": "Done"}

@app.delete("/appointments/{id}")
def delete(id: int):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("DELETE FROM appointments WHERE id=%s", (id,))
    db.commit()
    db.close()
    return {"msg": "Deleted"}

@app.put("/appointments/{id}/update")
def update_appointment(
    id: int,
    address: str = Form(...),
    problem: str = Form(...),
    solution: str = Form(...),
    fee: float = Form(...),
    gst: float = Form(...),
):
    total = fee + (fee * gst / 100)
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        """
        UPDATE appointments
        SET address=%s, problem=%s, solution=%s, fee=%s, gst=%s, total=%s
        WHERE id=%s
        """,
        (address, problem, solution, fee, gst, total, id)
    )
    db.commit()
    db.close()
    return {"msg": "Appointment updated successfully"}

# ---------------- FINANCE & LEDGER ----------------

@app.post("/add-expense")
def add_expense(reason: str = Form(...), amount: float = Form(...), date: str = Form(...)):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("INSERT INTO expenses (reason, amount, date) VALUES (%s, %s, %s)", (reason, amount, date))
    db.commit()
    db.close()
    return {"status": "success", "msg": "Expense added"}

@app.get("/expenses")
def get_expenses():
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT * FROM expenses ORDER BY id DESC")
    data = cursor.fetchall()
    db.close()
    return data

@app.delete("/delete-expense/{id}")
def delete_expense(id: int):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("DELETE FROM expenses WHERE id=%s", (id,))
    db.commit()
    db.close()
    return {"msg": "Expense deleted"}

@app.get("/finance-summary")
def get_finance_summary():
    db = get_db()
    cursor = db.cursor()
    
    cursor.execute("SELECT SUM(fee + (fee * gst / 100)) as appt_total FROM appointments WHERE status='completed' AND fee IS NOT NULL")
    res_appt = cursor.fetchone()
    appt_income = float(res_appt['appt_total']) if res_appt and res_appt['appt_total'] else 0.0
    
    cursor.execute("SELECT SUM(amount) as client_total FROM client_income")
    res_cl = cursor.fetchone()
    client_table_income = float(res_cl['client_total']) if res_cl and res_cl['client_total'] else 0.0
    
    total_income = appt_income + client_table_income
    
    cursor.execute("SELECT SUM(amount) as exp_total FROM expenses")
    res_expense = cursor.fetchone()
    total_expense = float(res_expense['exp_total']) if res_expense and res_expense['exp_total'] else 0.0
    
    db.close()
    return {
        "income": round(total_income, 2),
        "expense": round(total_expense, 2),
        "balance": round(total_income - total_expense, 2)
    }

@app.post("/add_credit")
def add_credit(name: str = Form(...), amount: float = Form(...), date: str = Form(...), note: str = Form("")):
    db = get_db()
    cursor = db.cursor()
    query = "INSERT INTO appointments (name, fee, status, date, problem) VALUES (%s, %s, 'completed', %s, %s)"
    cursor.execute(query, (name, amount, date, f"Manual Credit: {note}"))
    db.commit()
    db.close()
    return {"message": "Credit added successfully"}

@app.get("/get_credits")
def get_credits():
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT id, name, fee as amount, date, problem as note FROM appointments WHERE fee > 0 AND status='completed' ORDER BY date DESC")
    credits = cursor.fetchall()
    db.close()
    return credits

# ---------------- CLIENT INCOME (DIRECT) ----------------

@app.post("/add-income")
def add_income(name: str = Form(...), mobile: str = Form(...), amount: float = Form(...), date: str = Form(...)):
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO client_income (client_name, mobile_number, amount, payment_date) VALUES (%s, %s, %s, %s)",
        (name, mobile, amount, date)
    )
    db.commit()
    db.close()
    return {"msg": "Income added"}

@app.get("/get-income")
def get_income():
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT * FROM client_income ORDER BY payment_date DESC")
    data = cursor.fetchall()
    db.close()
    return data

@app.delete("/delete-income/{id}")
def delete_income(id: int):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("DELETE FROM client_income WHERE id=%s", (id,))
    db.commit()
    db.close()
    return {"msg": "Income deleted"}