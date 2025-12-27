import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Spinner, Container } from "react-bootstrap";
import Select from "react-select";
import { Card } from "reactstrap";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearError } from "../../redux/slices/authSlice";

const roleOptions = [
  { label: "Client", value: "client" },
  { label: "Customer", value: "customer" },
];

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get Redux state
  const { loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: null,
  });

  const [errors, setErrors] = useState({});

  
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleRoleChange = (role) => {
    setForm((p) => ({ ...p, role }));
    setErrors((p) => ({ ...p, role: "" }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email) newErrors.email = "Email is required";
    // test thorugth regex
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Invalid email";

    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (!form.role) newErrors.role = "Role is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      
      const mresponse = await dispatch(
        registerUser({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role.value,
        })
      );

      console.log("form regi component ::", mresponse.payload);
      let response = mresponse.payload

      if (response.status_code == 409) {
        toast.error(response.msg)
      }
      else if (response.status_code == 200) {
        toast.success(response.msg)
        navigate("/login");
      }
      else {
        toast.error("something we wrong try again!")
      }

    } catch (err) {
      toast.error("Something went wrong. Please try again!");
      console.error("Registration error:", err);
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: 500 }}>
      <h4 className="mb-4 text-center">Register</h4>

      {error && (
        <Alert variant="danger" dismissible onClose={() => dispatch(clearError())}>
          {error}
        </Alert>
      )}

      <Card style={{ padding: "8px" }}>
        <Form onSubmit={handleSubmit} noValidate>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              name="name"
              value={form.name}
              onChange={handleChange}
              isInvalid={!!errors.name}
              disabled={loading}
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              isInvalid={!!errors.email}
              disabled={loading}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              isInvalid={!!errors.password}
              disabled={loading}
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Role</Form.Label>
            <Select
              options={roleOptions}
              value={form.role}
              onChange={handleRoleChange}
              placeholder="Select role"
              isDisabled={loading}
            />
            {errors.role && (
              <div className="text-danger mt-1" style={{ fontSize: "0.875rem" }}>
                {errors.role}
              </div>
            )}
          </Form.Group>

          <div className="text-end m-1">
            <Link to="/login">Return to login</Link>
          </div>

          <Button type="submit" disabled={loading} className="w-100 mt-3">
            {loading ? (
              <>
                <Spinner size="sm" className="me-2" />
                Registering...
              </>
            ) : (
              "Register"
            )}
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default Register;