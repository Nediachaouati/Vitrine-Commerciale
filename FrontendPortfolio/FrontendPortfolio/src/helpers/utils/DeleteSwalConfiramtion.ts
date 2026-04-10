import Swal from 'sweetalert2';
interface DeleteSwalConfiramtionProps {
  msg: string;
}

export const DeleteSwalConfiramtion = (props: DeleteSwalConfiramtionProps) => {
  Swal.fire({ title: 'Deleted!', text: props.msg, icon: 'success', customClass: 'sweet-alerts' });
};
