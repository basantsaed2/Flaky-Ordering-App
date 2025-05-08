import React, { useState, useEffect } from 'react';
import RedLogo from '../../assets/Images/RedLogo';
import { Links } from '../Components';
import { Link, useLocation } from 'react-router-dom';
import { MdFavoriteBorder, MdRestaurantMenu } from 'react-icons/md';
import CartIcon from '../../assets/Icons/CartIcon';
import { LuUserRound } from 'react-icons/lu';
import { useDispatch, useSelector } from 'react-redux';
import FlakyLogo from '../../assets/Images/FlakyLogo.jpeg';
import { setLanguage } from '../../Store/CreateSlices'; // <-- Adjust this path
import { FaGlobe } from 'react-icons/fa';
import { useTranslation } from 'react-i18next'; // <-- Importing useTranslation hook

const Navbar = () => {
       const { t, i18n } = useTranslation(); // <-- use i18n to change language

    const location = useLocation();
    const dispatch = useDispatch();
    const user = useSelector(state => state.user?.data);
    const languages = useSelector(state => state.language ? state.language.data : []);
    const selectedLanguage = useSelector(state => state.language?.selected ?? 'en');
    const [pages] = useState(['/auth/login', '/auth/sign_up', '/auth/login/forgot_password', '/auth/otp_verification']);
    const [toggleOpen, setToggleOpen] = useState(false);
    const pickupLocation = useSelector(state => state.pickupLocation?.data || []); 

     // This effect runs every time the language changes
  useEffect(() => {
       // Change the language when the selectedLanguage in Redux updates
       if (selectedLanguage) {
         i18n.changeLanguage(selectedLanguage);
       }
     }, [selectedLanguage, i18n]); // Add i18n to the dependencies to ensure proper updating
   
     const handleLanguageChange = (e) => {
       const newLang = e.target.value;
       dispatch(setLanguage(newLang));  // Update Redux store with the new language
     };
    return (
        <>
            {pages.some(page => location.pathname === page) ? (
                ''
            ) : (
                <nav className='relative w-full flex align-center justify-between py-3 sm:px-5 xl:px-10 bg-white shadow-md'>
                    <div className='sm:w-6/12 xl:w-3/12 flex items-center justify-start gap-x-2 z-10'>
                        <Link to={'/'} className="flex items-center justify-start gap-x-2">
                            <img src={FlakyLogo} width={50} height={50} alt="Logo" />
                            <span className='text-2xl md:text-3xl text-mainColor font-TextFontRegular'>{t('Flaky')}</span>
                        </Link>
                    </div>
                    <div className='sm:hidden xl:flex w-5/12 items-center'>
                        <Links />
                    </div>

                    <div className='sm:hidden xl:flex w-3/12 items-center justify-end gap-x-4'>
                        {user ? (
                            <>
                                <div className="flex items-center gap-2 rounded px-4 py-2">
                                    <FaGlobe className="text-mainColor w-5 h-5" />
                                    {languages.length > 0 ? (
                                        <select
                                            onChange={handleLanguageChange}
                                            value={selectedLanguage || 'en'}
                                            className="bg-transparent text-mainColor focus:outline-none cursor-pointer text-md font-medium"
                                        >
                                            {languages.map((lang) => (
                                                <option key={lang.id} value={lang.name} className="text-sm text-mainColor">
                                                    {lang.name.toUpperCase()}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <span className="text-sm text-gray-400">Loading languages...</span>
                                    )}
                                </div>

                                <Link to={'/favorites'}>
                                    <MdFavoriteBorder className='text-mainColor text-3xl' />
                                </Link>
                                <Link to={'/cart'}>
                                    <CartIcon />
                                </Link>
                                <Link to={'/profile'}>
                                    <LuUserRound className='text-mainColor text-3xl' />
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    to={'/auth/login'}
                                    className='text-xl text-mainColor border-2 border-mainColor font-TextFontRegular px-5 py-1 rounded-full'
                                >
                                    {t('login')}
                                </Link>
                                <Link
                                    to={'/auth/sign_up'}
                                    className='text-xl text-white bg-mainColor border-2 border-mainColor font-TextFontRegular px-5 py-1 rounded-full'
                                >
                                    {t('signUp')}
                                </Link>
                            </>
                        )}
                    </div>
                    <div className='xl:hidden flex items-center justify-center'>
                        <div className="flex items-center rounded px-4 py-2">
                            <FaGlobe className="text-mainColor w-5 h-5" />
                            {languages.length > 0 ? (
                                <select
                                    onChange={(e) => dispatch(setLanguage(e.target.value))}
                                    value={selectedLanguage || 'en'}
                                    className="bg-transparent text-mainColor focus:outline-none cursor-pointer text-md font-medium"
                                >
                                    {languages.map((lang) => (
                                        <option key={lang.id} value={lang.name} className="text-sm text-mainColor">
                                            {lang.name.toUpperCase()}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <span className="text-sm text-gray-400">Loading languages...</span>
                            )}
                        </div>
                        <MdRestaurantMenu
                            onClick={() => setToggleOpen(!toggleOpen)}
                            className='text-mainColor text-4xl cursor-pointer z-10'
                        />
                    </div>

                    {/* Mobile Navbar  */}
                    <div
                        className={`w-full absolute ${toggleOpen ? 'top-16' : '-top-[400px]'} transition-all duration-300 left-0 bg-white shadow-md sm:flex xl:hidden flex-col items-center justify-center px-4 pb-3 rounded-br-3xl rounded-bl-3xl z-20`}
                    >
                        <div className='w-full flex flex-col'>
                            <Link
                                to={'Flaky_menu'}
                                className='w-full text-xl font-TextFontMedium text-mainColor border-b-2 p-3 pb-1'
                                onClick={() => setToggleOpen(false)}
                            >
                                {t('menu')}
                            </Link>
                            {/* <Link
                                to={'/location'}
                                className='w-full text-xl font-TextFontMedium text-mainColor border-b-2 p-3 pb-1'
                                onClick={() => setToggleOpen(false)}
                            >
                                {t('orderOnline')}
                            </Link> */}
                            <Link
                                to={'branches'}
                                className='w-full text-xl font-TextFontMedium text-mainColor border-b-2 p-3 pb-1'
                                onClick={() => setToggleOpen(false)}
                            >
                                {t('branch')}
                            </Link>
                            <Link
                                to={'/contact_us'}
                                className='w-full text-xl font-TextFontMedium text-mainColor border-b-2 p-3 pb-1'
                                onClick={() => setToggleOpen(false)}
                            >
                                {t('contactUs')}
                            </Link>
                        </div>
                        <div className='flex flex-col w-full items-center justify-center gap-y-2'>
                            {user ? (
                                <div className='w-full flex flex-col items-center justify-center gap-x-3'>
                                    <Link
                                        to={'/favorites'}
                                        className='w-full flex items-center gap-3 text-xl font-TextFontMedium text-mainColor border-b-2 p-3 pb-1'
                                        onClick={() => setToggleOpen(false)}
                                    >
                                        <MdFavoriteBorder className='text-mainColor text-2xl' /> {t('favorites')}
                                    </Link>
                                    <Link
                                        to={'/cart'}
                                        className='w-full flex items-center gap-3 text-xl font-TextFontMedium text-mainColor border-b-2 p-3 pb-1'
                                        onClick={() => setToggleOpen(false)}
                                    >
                                        <CartIcon /> {t('cart')}
                                    </Link>
                                    <Link
                                        to={'/profile'}
                                        className='w-full flex items-center gap-3 text-xl font-TextFontMedium text-mainColor border-b-2 p-3 pb-1'
                                        onClick={() => setToggleOpen(false)}
                                    >
                                        <LuUserRound className='text-mainColor text-2xl' /> {t('profile')}
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <Link
                                        to={'/auth/login'}
                                        onClick={() => setToggleOpen(false)}
                                        className='w-full text-center text-xl text-mainColor border-2 border-mainColor font-TextFontRegular px-5 py-1 rounded-full'
                                    >
                                        {t('login')}
                                    </Link>
                                    <Link
                                        to={'/auth/sign_up'}
                                        onClick={() => setToggleOpen(false)}
                                        className='w-full text-center text-xl text-white bg-mainColor border-2 border-mainColor font-TextFontRegular px-5 py-1 rounded-full'
                                    >
                                        {t('signUp')}
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </nav>
            )}
        </>
    );
};

export default Navbar;
