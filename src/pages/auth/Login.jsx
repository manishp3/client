import React, { useState } from "react";
import { Form, Button, Alert, Spinner, Container } from "react-bootstrap";
import { PostApiCall } from "../../utils/Api_Client"; // adjust path
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../redux/slices/authSlice";
import { useDispatch } from "react-redux";

const Login = () => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate()

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));

  
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  
  const validate = () => {
    const newErrors = {};

    if (!form.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Invalid email format";

    if (!form.password)
      newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  console.log("process.env.env.REACT_APP_API_URL", process.env.REACT_APP_API_URL);

  //  submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      
      const mresponse = await dispatch(
        loginUser({
          email: form.email,
          password: form.password,
        })
      );
      console.log("log of login mresponse::", mresponse.payload);
      let response = mresponse.payload;
      
      if (response.status_code == 404) {
        toast.error(response.msg)
      }
      else if (response.status_code == 401) {
        toast.error(response.msg)
      }
      else if (response.status_code == 200) {
        toast.success(response.msg)
        await localStorage.setItem("token", response.token)
        navigate("/dashboard")
        window.location.reload();
      }
      else {
        toast.error("something we wrong try again!")
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again!");
      console.error("Login error:", err);
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: 400 }}>
      <h4 className="mb-4">Login</h4>

      {apiError && <Alert variant="danger">{apiError}</Alert>}

      <Form onSubmit={handleSubmit} noValidate>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            name="email"
            value={form.email}
            onChange={handleChange}
            isInvalid={!!errors.email}
          />
          <Form.Control.Feedback type="invalid">
            {errors.email}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            isInvalid={!!errors.password}
          />
          <Form.Control.Feedback type="invalid">
            {errors.password}
          </Form.Control.Feedback>
        </Form.Group>
        <div className="text-end m-1">
          <Link to="/register">Register here</Link>
        </div>

        <Button type="submit" disabled={loading} className="w-100">
          {loading ? <Spinner size="sm" /> : "Login"}
        </Button>
      </Form>
    </Container>
  );
};

export default Login;
