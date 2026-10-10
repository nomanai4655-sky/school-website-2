from flask import Flask, render_template, request, redirect, url_for, session, flash
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from datetime import timedelta
import os
import random

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "change_this_secret_key")
app.permanent_session_lifetime = timedelta(days=30)

if os.environ.get("VERCEL"):
    DB_NAME = "/tmp/school.db"
    UPLOAD_FOLDER = "/tmp/uploads"
else:
    DB_NAME = "school.db"
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

ADMIN_USERNAME = os.environ.get("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "admin123")


# ---------- DATABASE SETUP ----------
def init_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS admissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_name TEXT NOT NULL,
            father_name TEXT NOT NULL,
            class_applying TEXT NOT NULL,
            past_school TEXT,
            certificate_filename TEXT,
            phone TEXT,
            address TEXT,
            status TEXT DEFAULT 'Pending',
            tracking_code TEXT,
            submitted_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            message TEXT NOT NULL,
            submitted_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    """)
    try:
        cursor.execute("ALTER TABLE admissions ADD COLUMN status TEXT DEFAULT 'Pending'")
    except sqlite3.OperationalError:
        pass
    try:
        cursor.execute("ALTER TABLE admissions ADD COLUMN tracking_code TEXT")
    except sqlite3.OperationalError:
        pass
    conn.commit()
    conn.close()


def get_db_connection():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn


def generate_tracking_code(conn):
    """4-digit code the student uses to check their admission status later."""
    while True:
        code = str(random.randint(1000, 9999))
        existing = conn.execute(
            "SELECT id FROM admissions WHERE tracking_code = ?", (code,)
        ).fetchone()
        if not existing:
            return code


init_db()


# ---------- PUBLIC PAGES ----------
@app.route("/")
def home():
    return render_template("home.html")


@app.route("/about")
def about():
    return render_template("about.html")


@app.route("/academics")
def academics():
    return render_template("academics.html")


@app.route("/admission", methods=["GET", "POST"])
def admission():
    if request.method == "POST":
        student_name = request.form.get("student_name")
        father_name = request.form.get("father_name")
        class_applying = request.form.get("class_applying")
        past_school = request.form.get("past_school")
        phone = request.form.get("phone")
        address = request.form.get("address")

        if not student_name or not father_name or not class_applying or not phone:
            flash("Please fill in the required fields: Student Name, Father's Name, Class, and Phone Number.")
            return redirect(url_for("admission"))

        certificate_filename = None
        certificate_file = request.files.get("certificate")
        if certificate_file and certificate_file.filename:
            certificate_filename = secure_filename(certificate_file.filename)
            try:
                certificate_file.save(os.path.join(UPLOAD_FOLDER, certificate_filename))
            except OSError:
                certificate_filename = None

        conn = get_db_connection()
        tracking_code = generate_tracking_code(conn)
        conn.execute(
            """INSERT INTO admissions
               (student_name, father_name, class_applying, past_school, certificate_filename, phone, address, tracking_code)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
            (student_name, father_name, class_applying, past_school, certificate_filename, phone, address, tracking_code),
        )
        conn.commit()
        conn.close()

        flash(f"Thank you! Your application has been received. Your Tracking Code is: {tracking_code} — please save this code, you'll need it to check your admission status.")
        return redirect(url_for("admission"))

    return render_template("admission.html")


# ---------- ADMISSION STATUS CHECKER (public, no login needed) ----------
@app.route("/admission-status", methods=["GET", "POST"])
def admission_status():
    result = None
    searched = False
    if request.method == "POST":
        code = request.form.get("tracking_code", "").strip()
        searched = True
        if code:
            conn = get_db_connection()
            result = conn.execute(
                "SELECT * FROM admissions WHERE tracking_code = ?", (code,)
            ).fetchone()
            conn.close()
    return render_template("admission_status.html", result=result, searched=searched)


@app.route("/gallery")
def gallery():
    return render_template("gallery.html")


@app.route("/timetable")
def timetable():
    return render_template("timetable.html")


@app.route("/events")
def events():
    return render_template("events.html")


@app.route("/news")
def news():
    return render_template("news.html")


@app.route("/contact", methods=["GET", "POST"])
def contact():
    if request.method == "POST":
        name = request.form.get("name")
        email = request.form.get("email")
        message = request.form.get("message")

        conn = get_db_connection()
        conn.execute(
            "INSERT INTO messages (name, email, message) VALUES (?, ?, ?)",
            (name, email, message),
        )
        conn.commit()
        conn.close()

        flash(f"Thanks {name}! Your message has been received.")
        return redirect(url_for("contact"))
    return render_template("contact.html")


# ---------- LOGIN & SIGNUP (combined single page) ----------
@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        form_type = request.form.get("form_type")

        if form_type == "signup":
            name = request.form.get("name")
            email = request.form.get("email")
            password = request.form.get("password")

            if not name or not email or not password:
                flash("Please fill in all fields.")
                return redirect(url_for("login", mode="signup"))

            hashed_password = generate_password_hash(password)

            conn = get_db_connection()
            try:
                cursor = conn.execute(
                    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
                    (name, email, hashed_password),
                )
                conn.commit()
                new_user_id = cursor.lastrowid
            except sqlite3.IntegrityError:
                flash("An account with this email already exists.")
                conn.close()
                return redirect(url_for("login", mode="signup"))
            conn.close()

            session.permanent = True
            session["user_id"] = new_user_id
            session["user_name"] = name
            flash(f"Account created successfully! Welcome, {name}!")
            return redirect(url_for("dashboard"))

        else:
            email = request.form.get("email")
            password = request.form.get("password")
            remember = request.form.get("remember")

            conn = get_db_connection()
            user = conn.execute(
                "SELECT * FROM users WHERE email = ?", (email,)
            ).fetchone()
            conn.close()

            if user and check_password_hash(user["password"], password):
                session.permanent = bool(remember)
                session["user_id"] = user["id"]
                session["user_name"] = user["name"]
                flash(f"Welcome back, {user['name']}!")
                return redirect(url_for("dashboard"))
            else:
                flash("Invalid email or password.")
                return redirect(url_for("login"))

    return render_template("auth.html")


@app.route("/forgot-password")
def forgot_password():
    return render_template("forgot_password.html")


@app.route("/logout")
def logout():
    session.clear()
    flash("You have been logged out.")
    return redirect(url_for("home"))


@app.route("/dashboard")
def dashboard():
    if "user_id" not in session:
        flash("Please log in to view this page.")
        return redirect(url_for("login"))
    return render_template("dashboard.html", name=session.get("user_name"))


# ---------- ADMIN ----------
@app.route("/admin-login", methods=["GET", "POST"])
def admin_login():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")

        if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
            session["is_admin"] = True
            flash("Welcome, Admin!")
            return redirect(url_for("admin_panel"))
        else:
            flash("Invalid admin username or password.")
            return redirect(url_for("admin_login"))

    return render_template("admin_login.html")


@app.route("/admin")
def admin_panel():
    if not session.get("is_admin"):
        flash("Please log in as admin to view this page.")
        return redirect(url_for("admin_login"))

    conn = get_db_connection()
    admissions = conn.execute(
        "SELECT * FROM admissions ORDER BY submitted_at DESC"
    ).fetchall()
    users = conn.execute(
        "SELECT id, name, email FROM users ORDER BY id DESC"
    ).fetchall()
    messages = conn.execute(
        "SELECT * FROM messages ORDER BY submitted_at DESC"
    ).fetchall()
    conn.close()

    return render_template(
        "admin_panel.html",
        admissions=admissions,
        users=users,
        messages=messages,
    )


@app.route("/admin/update-status/<int:admission_id>", methods=["POST"])
def admin_update_status(admission_id):
    if not session.get("is_admin"):
        flash("Please log in as admin to view this page.")
        return redirect(url_for("admin_login"))

    new_status = request.form.get("status")
    if new_status not in ("Pending", "Approved", "Rejected"):
        flash("Invalid status.")
        return redirect(url_for("admin_panel"))

    conn = get_db_connection()
    conn.execute(
        "UPDATE admissions SET status = ? WHERE id = ?", (new_status, admission_id)
    )
    conn.commit()
    conn.close()

    flash("Status updated.")
    return redirect(url_for("admin_panel"))


@app.route("/admin-logout")
def admin_logout():
    session.pop("is_admin", None)
    flash("Admin logged out.")
    return redirect(url_for("home"))


if __name__ == "__main__":
    app.run(debug=True)
