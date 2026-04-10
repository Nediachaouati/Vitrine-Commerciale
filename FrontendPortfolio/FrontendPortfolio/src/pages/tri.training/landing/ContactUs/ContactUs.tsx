import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setPageTitle, toggleRTL } from '../../../../store/themeConfigSlice';
import { IRootState } from '../../../../Redux/store';
import IconCaretDown from '../../../../components/Icon/IconCaretDown';
import IconUser from '../../../../components/Icon/IconUser';
import IconMail from '../../../../components/Icon/IconMail';
import IconPhoneCall from '../../../../components/Icon/IconPhoneCall';
import IconPencil from '../../../../components/Icon/IconPencil';
import IconMessageDots from '../../../../components/Icon/IconMessageDots';

const ContactUs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formSubmitted, setFormSubmitted] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    dispatch(setPageTitle('Contact Us'));
  }, [dispatch]);

  const themeConfig = useSelector((state: IRootState) => state.themeConfig);
  const [flag, setFlag] = useState(themeConfig.locale);
  const setLocale = (flag: string) => {
    setFlag(flag);
    if (flag.toLowerCase() === 'ae') {
      dispatch(toggleRTL('rtl'));
    } else {
      dispatch(toggleRTL('ltr'));
    }
  };

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      name,
      email,
      phone,
      subject,
      message,
    };

    console.log('Données envoyées :', data);
    setFormSubmitted(true);

    // Vider les champs après envoi
    setName('');
    setEmail('');
    setPhone('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className={`animate__fadeIn animate__animated`}>
      <div className="relative flex h-[calc(100vh_-_150px)] items-center justify-center bg-[url(https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/content-gallery-3.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
        <div className="relative flex w-full max-w-[1502px] flex-col justify-between overflow-hidden rounded-md bg-white/60 dark:bg-black/50 lg:min-h-[758px] lg:flex-row lg:gap-10 xl:gap-0">
          <div className="relative hidden w-full items-center justify-center bg-primary p-5 lg:inline-flex lg:max-w-[835px] xl:-ms-28 ltr:xl:skew-x-[14deg] rtl:xl:skew-x-[-14deg]">
            <div className="absolute inset-y-0 w-8 from-primary/10 via-transparent to-transparent ltr:-right-10 ltr:bg-gradient-to-r rtl:-left-10 rtl:bg-gradient-to-l xl:w-16 ltr:xl:-right-20 rtl:xl:-left-20"></div>
            <div className="ltr:xl:-skew-x-[14deg] rtl:xl:skew-x-[14deg]">
              <Link to="/" className="w-48 lg:w-72 ms-10">
                <div className="horizontal-logo flex items-center">
                  <img src="/assets/images/logo_-triWhite.png" alt="Logo" className="w-10" />
                  <span className="text-4xl ltr:ml-3 rtl:mr-3 font-bold text-white">VITRINE</span>
                </div>
              </Link>
              <div className="mt-24 hidden w-full max-w-[430px] lg:block">
                <img src="/assets/images/auth/contact-us.svg" alt="Cover Image" className="w-full" />
              </div>
            </div>
          </div>

          <div className="relative flex w-full flex-col items-center justify-center gap-6 px-4 pb-16 pt-6 sm:px-6 lg:max-w-[667px]">
            <div className="w-full max-w-[440px] lg:mt-16">
              <div className="mb-10">
                <h1 className="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">Contact us</h1>
                <p className="text-base font-bold leading-normal">
                  {formSubmitted ? 'Thank you for contacting us. We will get back to you soon.' : 'Submit your queries and we will get back to you as soon as possible.'}
                </p>
              </div>
              <form className="space-y-5" onSubmit={submitForm}>
                <div className="relative text-white-dark">
                  <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="form-input ps-10 placeholder:text-white-dark" required />
                  <span className="absolute start-4 top-1/2 -translate-y-1/2">
                    <IconUser fill={true} />
                  </span>
                </div>
                <div className="relative text-white-dark">
                  <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-input ps-10 placeholder:text-white-dark" required />
                  <span className="absolute start-4 top-1/2 -translate-y-1/2">
                    <IconMail fill={true} />
                  </span>
                </div>
                <div className="relative text-white-dark">
                  <input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="form-input ps-10 placeholder:text-white-dark" required />
                  <span className="absolute start-4 top-1/2 -translate-y-1/2">
                    <IconPhoneCall fill={true} />
                  </span>
                </div>
                <div className="relative text-white-dark">
                  <input type="text" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} className="form-input ps-10 placeholder:text-white-dark" required />
                  <span className="absolute start-4 top-1/2 -translate-y-1/2">
                    <IconPencil fill={true} />
                  </span>
                </div>
                <div className="relative text-white-dark">
                  <textarea
                    rows={4}
                    placeholder="Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="form-textarea resize-none ps-10 placeholder:text-white-dark"
                    required
                  />
                  <span className="absolute start-4 top-2.5">
                    <IconMessageDots fill={true} />
                  </span>
                </div>
                <button type="submit" className="btn bg-primary text-white mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_#d50a12]">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
