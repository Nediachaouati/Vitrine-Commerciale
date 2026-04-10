import { useEffect } from 'react';

import Swal from 'sweetalert2';

interface ModalRemoveProps {
  message: string;
  title: string;
  open: boolean;
  openSucess: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const ModalRemove = ({ open, openSucess, onConfirm, onClose, message, title }: ModalRemoveProps) => {
  useEffect(() => {
    if (open) {
      showAlert();
    }
  }, [open]);

  useEffect(() => {
    if (openSucess) {
      showAlertSucess();
    }
  }, [openSucess]);

  const showAlert = async () => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-secondary',
        cancelButton: 'btn btn-dark ltr:mr-3 rtl:ml-3',
        popup: 'sweet-alerts',
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: title,
        text: message,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true,
        padding: '2em',
      })
      .then(async (result) => {
        if (result.value) {
          onConfirm();
        } else {
          if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons.fire('Annuler', 'Opération annulée', 'error');
            onClose();
          } else if (result.dismiss === Swal.DismissReason.backdrop) {
            onClose();
          }
        }
      });
  };

  const showAlertSucess = async () => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-secondary',
        cancelButton: 'btn btn-dark ltr:mr-3 rtl:ml-3',
        popup: 'sweet-alerts',
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons.fire('', message, 'success');
  };

  return <></>;
};
