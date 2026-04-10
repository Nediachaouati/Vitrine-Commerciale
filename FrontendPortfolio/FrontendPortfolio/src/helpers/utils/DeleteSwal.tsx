import { useEffect } from 'react';
import Swal from 'sweetalert2';

interface DeleteSwalProps {
  open: boolean;
  onDelete: () => void;
  OnCancelDelete: () => void;
}

export const DeleteSwal = (props: DeleteSwalProps) => {
  useEffect(() => {
    if (props.open) {
      deleteShow();
    }
  }, [props.open]);
  const deleteShow = () => {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonText: 'Delete',
      padding: '2em',
      customClass: 'sweet-alerts',
    }).then((result) => {
      console.log('result');
      console.log(result);
      if (result.value) {
        props.onDelete();
      } else if (result.isDismissed === true) {
        Swal.fire('Cancelled', 'Your imaginary file is safe :)', 'error');
        props.OnCancelDelete();
      }
    });
  };

  return <></>;
};
