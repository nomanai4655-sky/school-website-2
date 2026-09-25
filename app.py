from flask import Flask, render_template, request, redirect, url_for, session, flash
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
import os

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "change_this_secret_key")

# Vercel's filesystem is read-only except for /tmp, so the database
# must live there when running on Vercel. Locally it just uses the
# current folder. Note: /tmp on Vercel is temporary and can be wiped
# between deployments/cold starts, so signup data won't persist
# reliably in production — see the note below the code.
if os.environ.get("VERCEL"):
    DB_NAME = "/tmp/school.db"
else:
    DB_NAME = "school.db"


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
    conn.commit()
    conn.close()


def get_db_connection():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn


# Initialize the database when the module loads. This must run at
# import time (not just inside `if __name__ == "__main__"`) because
# Vercel imports this file directly and never runs that block.
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


@app.route("/admission")
def admission():
    return render_template("admission.html")


@app.route("/gallery")
def gallery():
    return render_template("gallery.html")


@app.route("/contact", methods=["GET", "POST"])
def contact():
    if request.method == "POST":
        name = request.form.get("name")
        flash(f"Thanks {name}! Your message has been received.")
        return redirect(url_for("contact"))
    return render_template("contact.html")


# ---------- SIGNUP ----------
@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        name = request.form.get("name")
        email = request.form.get("email")
        password = request.form.get("password")

        if not name or not email or not password:
            flash("Please fill in all fields.")
            return redirect(url_for("signup"))

        hashed_password = generate_password_hash(password)

        conn = get_db_connection()
        try:
            conn.execute(
                "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
                (name, email, hashed_password),
            )
            conn.commit()
        except sqlite3.IntegrityError:
            flash("An account with this email already exists.")
            conn.close()
            return redirect(url_for("signup"))
        conn.close()

        flash("Account created successfully! Please log in.")
        return redirect(url_for("login"))

    return render_template("signup.html")


# ---------- LOGIN ----------
@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form.get("email")
        password = request.form.get("password")

        conn = get_db_connection()
        user = conn.execute(
            "SELECT * FROM users WHERE email = ?", (email,)
        ).fetchone()
        conn.close()

        if user and check_password_hash(user["password"], password):
            session["user_id"] = user["id"]
            session["user_name"] = user["name"]
            flash(f"Welcome back, {user['name']}!")
            return redirect(url_for("dashboard"))
        else:
            flash("Invalid email or password.")
            return redirect(url_for("login"))

    return render_template("login.html")


# ---------- LOGOUT ----------
@app.route("/logout")
def logout():
    session.clear()
    flash("You have been logged out.")
    return redirect(url_for("home"))


# ---------- DASHBOARD (protected page) ----------
@app.route("/dashboard")
def dashboard():
    if "user_id" not in session:
        flash("Please log in to view this page.")
        return redirect(url_for("login"))
    return render_template("dashboard.html", name=session.get("user_name"))


if __name__ == "__main__":
    app.run(debug=True)
