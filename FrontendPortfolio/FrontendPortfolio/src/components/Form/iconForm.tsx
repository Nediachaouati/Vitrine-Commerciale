import IconLockDots from '../Icon/IconLockDots';
import IconMail from '../Icon/IconMail';

const IconForm = (nameIcon: any) => {
  return (
    <>
      <span className="absolute start-4 top-1/2 -translate-y-1/2">
        {nameIcon && nameIcon.nameIcon === 'password' ? <IconLockDots fill={true} /> : <></>}
        {nameIcon && nameIcon.nameIcon === 'email' ? <IconMail fill={true} /> : <></>}
      </span>
    </>
  );
};

export default IconForm;
