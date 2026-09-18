import { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useLocation,
  useParams
} from "react-router-dom";
import api from "./api";
import {
  clearAuth,
  getStoredUser,
  isLoggedIn,
  saveAuth
} from "./auth";

function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(getStoredUser());

  // Login saves the backend profile in localStorage. Refresh the navigation
  // after route changes so the correct user/organizer links appear right away.
  useEffect(() => {
    setUser(getStoredUser());
  }, [location.pathname]);

  const logout = () => {
    clearAuth();
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="app">
      <header className="navbar">
        <Link className="logo" to="/">
          Event<span>Hub</span>
        </Link>

        <nav>
          <NavLink to="/" end>Events</NavLink>

          {user && (
            <NavLink to="/my-registrations">My Registrations</NavLink>
          )}

          {user?.role === "organizer" && (
            <NavLink to="/create-event">Create Event</NavLink>
          )}

          {user ? (
            <>
              <NavLink to="/profile">Profile</NavLink>
              <button className="nav-button" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <Link className="nav-cta" to="/register">
                Get Started
              </Link>
            </>
          )}
        </nav>
      </header>

      <main>{children}</main>

      <footer>EventHub · Event Registration System</footer>
    </div>
  );
}

function ProtectedRoute({ children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function OrganizerRoute({ children }) {
  const user = getStoredUser();

  if (user?.role !== "organizer") {
    return <Navigate to="/" replace />;
  }

  return children;
}

function Message({ children, type = "error" }) {
  if (!children) return null;

  return <div className={`message ${type}`}>{children}</div>;
}

function AuthPage({ login = false }) {
  const navigate = useNavigate();
  const [form, setForm] = useState(
    login
      ? { identifier: "", password: "" }
      : {
          displayName: "",
          username: "",
          email: "",
          password: ""
        }
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (login) {
        const body = {
          password: form.password
        };

        if (form.identifier.includes("@")) {
          body.email = form.identifier;
        } else {
          body.username = form.identifier;
        }

        const response = await api.post("/auth/login", body);
        saveAuth(response.data.token);

        try {
          const profile = await api.get("/auth/profile");
          saveAuth(response.data.token, profile.data);
        } catch {}

        navigate("/");
      } else {
        await api.post("/auth/register", form);
        navigate("/login");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="eyebrow">
          {login ? "WELCOME BACK" : "JOIN EVENTHUB"}
        </div>

        <h1>
          {login ? "Sign in to your account" : "Create your account"}
        </h1>

        <p className="muted">
          {login
            ? "Manage your events and registrations in one place."
            : "Discover events and reserve your spot."}
        </p>

        <Message>{error}</Message>

        <form onSubmit={submit}>
          {!login && (
            <>
              <label>
                Display Name
                <input
                  name="displayName"
                  value={form.displayName}
                  onChange={update}
                  required
                />
              </label>

              <label>
                Username
                <input
                  name="username"
                  value={form.username}
                  onChange={update}
                  required
                />
              </label>

              <label>
                Email
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={update}
                  required
                />
              </label>
            </>
          )}

          {login && (
            <label>
              Username or Email
              <input
                name="identifier"
                value={form.identifier}
                onChange={update}
                required
              />
            </label>
          )}

          <label>
            Password
            <input
              type="password"
              name="password"
              minLength="8"
              value={form.password}
              onChange={update}
              required
            />
          </label>

          <button className="primary full" disabled={loading}>
            {loading
              ? "Please wait..."
              : login
              ? "Sign In"
              : "Create Account"}
          </button>
        </form>

        <p className="switch">
          {login ? "Don't have an account? " : "Already have an account? "}
          <Link to={login ? "/register" : "/login"}>
            {login ? "Register" : "Sign in"}
          </Link>
        </p>
      </div>
    </section>
  );
}

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/event/getAllEvent")
      .then((response) => setEvents(response.data.events || []))
      .catch((err) => {
        // This backend returns 404 when its events collection is empty.
        if (err.response?.status === 404) {
          setEvents([]);
          return;
        }

        setError(
          err.response?.data?.message ||
          "Unable to load events."
        );
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="container">
      <div className="hero">
        <div>
          <div className="eyebrow">DISCOVER · REGISTER · ATTEND</div>
          <h1>
            Find your next
            <br />
            <span>great event.</span>
          </h1>
          <p>
            Browse upcoming events, reserve your place, and keep
            your registrations organized.
          </p>
        </div>

        <div className="hero-mark">✦</div>
      </div>

      <div className="section-head">
        <div>
          <div className="eyebrow">UPCOMING</div>
          <h2>Available Events</h2>
        </div>

        <span className="count">
          {events.length} event{events.length === 1 ? "" : "s"}
        </span>
      </div>

      {loading && <div className="empty">Loading events...</div>}

      {!loading && error && <Message>{error}</Message>}

      {!loading && !error && events.length === 0 && (
        <div className="empty">
          No events are available right now.
        </div>
      )}

      <div className="event-grid">
        {events.map((event) => (
          <article className="event-card" key={event._id}>
            <div className="date-chip">
              {new Date(event.date).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric"
              })}
            </div>

            <h3>{event.eventName}</h3>

            <p>{event.description}</p>

            <div className="event-meta">
              <span>📍 {event.location}</span>
              <span>👥 {event.capacity} seats</span>
            </div>

            <Link
              className="secondary full button-link"
              to={`/events/${event._id}`}
            >
              View Event
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

function EventDetailsPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  useEffect(() => {
    api.get(`/event/getEvent/${eventId}`)
      .then((response) => setEvent(response.data.event))
      .catch((err) => {
        setMessage(
          err.response?.data?.message ||
          "Event not found."
        );
      })
      .finally(() => setLoading(false));
  }, [eventId]);

  const register = async () => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }

    setMessage("");

    try {
      await api.post(`/register/registerForEvent/${eventId}`);
      setMessageType("success");
      setMessage("You are successfully registered for this event.");
    } catch (err) {
      setMessageType("error");
      setMessage(
        err.response?.data?.message ||
        "Registration failed."
      );
    }
  };

  if (loading) {
    return <div className="empty">Loading event...</div>;
  }

  if (!event) {
    return (
      <div className="empty">
        <Message>{message}</Message>
        <button className="secondary" onClick={() => navigate("/")}>
          Back to Events
        </button>
      </div>
    );
  }

  return (
    <section className="container narrow">
      <button className="back" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <article className="detail-card">
        <div className="detail-date">
          {new Date(event.date).toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric"
          })}
        </div>

        <h1>{event.eventName}</h1>
        <p className="lead">{event.description}</p>

        <div className="detail-grid">
          <div>
            <small>LOCATION</small>
            <strong>📍 {event.location}</strong>
          </div>

          <div>
            <small>CAPACITY</small>
            <strong>👥 {event.capacity} seats</strong>
          </div>
        </div>

        <Message type={messageType}>{message}</Message>

        <button className="primary full" onClick={register}>
          Register for Event
        </button>
      </article>
    </section>
  );
}

function ProfilePage() {
  const [profile, setProfile] = useState(getStoredUser());
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/auth/profile")
      .then((response) => {
        setProfile(response.data);

        const token = localStorage.getItem("event_token");
        if (token) {
          saveAuth(token, response.data);
        }
      })
      .catch((err) => {
        setError(
          err.response?.data?.message ||
          "Unable to load profile."
        );
      });
  }, []);

  return (
    <section className="container narrow">
      <div className="page-title">
        <div className="eyebrow">ACCOUNT</div>
        <h1>Your Profile</h1>
      </div>

      <div className="profile-card">
        <Message>{error}</Message>

        <div className="avatar">
          {profile?.displayName?.charAt(0)?.toUpperCase() || "U"}
        </div>

        <h2>{profile?.displayName || "User"}</h2>
        <p className="muted">@{profile?.username || "username"}</p>

        <div className="profile-row">
          <span>Email</span>
          <strong>{profile?.email || "—"}</strong>
        </div>

        <div className="profile-row">
          <span>Role</span>
          <strong>{profile?.role || "User"}</strong>
        </div>
      </div>
    </section>
  );
}

function MyRegistrationsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadRegistrations = async () => {
    setError("");

    try {
      const response = await api.get("/register/getUserEvent");
      setRegistrations(response.data.userRegistrations || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to load registrations."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRegistrations();
  }, []);

  const cancelRegistration = async (eventId) => {
    try {
      await api.delete(
        `/register/cancelUserRegistration/${eventId}`
      );

      setMessage("Registration cancelled successfully.");
      await loadRegistrations();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to cancel registration."
      );
    }
  };

  return (
    <section className="container">
      <div className="page-title">
        <div className="eyebrow">YOUR ACTIVITY</div>
        <h1>My Registrations</h1>
        <p className="muted">
          Events you've reserved a place for.
        </p>
      </div>

      <Message type="success">{message}</Message>
      <Message>{error}</Message>

      {loading ? (
        <div className="empty">Loading registrations...</div>
      ) : !error && registrations.length === 0 ? (
        <div className="empty">
          No registrations found. <Link to="/">Browse events</Link>
        </div>
      ) : (
        <div className="registration-list">
          {registrations.map((registration) => {
            const event =
              registration.event &&
              typeof registration.event === "object"
                ? registration.event
                : null;

            const eventId =
              event?._id || registration.event;

            return (
              <div className="registration-card" key={registration._id}>
                <div>
                  <span className="status">REGISTERED</span>

                  <h3>
                    {event?.eventName ||
                      `Event ${registration.event}`}
                  </h3>

                  <p>
                    {event?.location || "Event location"}
                    {" · "}
                    Registered{" "}
                    {registration.registeredAt
                      ? new Date(
                          registration.registeredAt
                        ).toLocaleDateString()
                      : ""}
                  </p>
                </div>

                <button
                  className="danger"
                  onClick={() => cancelRegistration(eventId)}
                >
                  Cancel
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function CreateEventPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    eventName: "",
    date: "",
    location: "",
    description: "",
    capacity: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await api.post("/event/createEvent", {
        ...form,
        capacity: Number(form.capacity)
      });

      setSuccess("Event created successfully.");

      setTimeout(() => {
        navigate("/");
      }, 900);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to create event."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container narrow">
      <div className="page-title">
        <div className="eyebrow">ORGANIZER</div>
        <h1>Create an Event</h1>
        <p className="muted">
          Publish a new event for attendees.
        </p>
      </div>

      <div className="form-card">
        <Message type="success">{success}</Message>
        <Message>{error}</Message>

        <form onSubmit={submit}>
          <label>
            Event Name
            <input
              name="eventName"
              value={form.eventName}
              onChange={update}
              required
            />
          </label>

          <label>
            Date and Time
            <input
              type="datetime-local"
              name="date"
              value={form.date}
              onChange={update}
              required
            />
          </label>

          <label>
            Location
            <input
              name="location"
              value={form.location}
              onChange={update}
              required
            />
          </label>

          <label>
            Description
            <textarea
              name="description"
              rows="5"
              value={form.description}
              onChange={update}
              required
            />
          </label>

          <label>
            Capacity
            <input
              type="number"
              name="capacity"
              min="1"
              value={form.capacity}
              onChange={update}
              required
            />
          </label>

          <button className="primary full" disabled={loading}>
            {loading ? "Creating..." : "Create Event"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<EventsPage />} />
        <Route
          path="/events/:eventId"
          element={<EventDetailsPage />}
        />
        <Route
          path="/login"
          element={<AuthPage login />}
        />
        <Route
          path="/register"
          element={<AuthPage />}
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-registrations"
          element={
            <ProtectedRoute>
              <MyRegistrationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-event"
          element={
            <ProtectedRoute>
              <OrganizerRoute>
                <CreateEventPage />
              </OrganizerRoute>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
