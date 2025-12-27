import { Modal, Button } from "react-bootstrap";
import { CiLogout } from "react-icons/ci";

const LogoutConfirmationModal = ({ show, onClose, onConfirm, loading }) => {
    return (
        <Modal show={show} onHide={onClose} centered backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Confirm Logout</Modal.Title>
            </Modal.Header>

            <Modal.Body className="text-center">
                <CiLogout size={40} className="text-danger mb-3" />
                <p className="mb-0">
                    Are you sure you want to Logout?
                </p>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={onConfirm} disabled={loading}>
                    Logout
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default LogoutConfirmationModal;
