import Swal, { SweetAlertIcon } from 'sweetalert2';

export const ShowSweetAlert = async (type: SweetAlertIcon, msg: string) => {
  const toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });
  toast.fire({
    icon: type,
    title: msg,
    padding: '10px 20px',
  });
};
