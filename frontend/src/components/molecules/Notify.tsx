import { toast } from 'sonner';

type Props = {
  type: 'success' | 'warning' | 'error' | 'info' | 'default' | 'loading';
  title?: string;
  message: string;
  duration?: number;
  messageClassName?: string;
  id?: string;
};

export default function Notify({
  type,
  title,
  message,
  duration,
  messageClassName,
  id,
}: Props) {
  switch (type) {
    case 'loading':
      return toast.loading(title, {
        id,
        description: message,
        descriptionClassName: messageClassName,
        duration,
      });
    case 'success':
      return toast.success(title, {
        id,
        description: message,
        descriptionClassName: messageClassName,
        duration,
      });
    case 'error':
      return toast.error(title, {
        id,
        description: message,
        descriptionClassName: messageClassName,
        duration,
      });
    case 'warning':
      return toast.warning(title, {
        id,
        description: message,
        descriptionClassName: messageClassName,
        duration,
      });
    case 'info':
      return toast.info(title, {
        id,
        description: message,
        descriptionClassName: messageClassName,
        duration,
      });
    default:
      return toast.message(title, {
        id,
        description: message,
        descriptionClassName: messageClassName,
        duration,
      });
      break;
  }
}
