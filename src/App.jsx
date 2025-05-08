import { Footer, LoaderLogin, Navbar } from './Components/Components';
import './index.css';
import { Outlet, useLocation } from 'react-router-dom';// index.js or App.js
import './i18n';  // Initialize i18next globally

import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import { useGet } from './Hooks/useGet';
import { useDispatch, useSelector } from 'react-redux';
import {setLocations, setCategories, setCheckOutDetails, setProducts, setProductsDiscount, setProductsDiscountFilter, setProductsFilter, setSignUpType, setTaxType ,setBanners,setBranch, setLanguageData} from './Store/CreateSlices';
import { useEffect, useRef } from 'react';
import { MaintenancePage } from './Pages/page';

const App = () => {

  const user = useSelector((state) => state?.user?.data || null);
  const dispatch = useDispatch();
  const location = useLocation();
  const selectedLanguage = useSelector(state => state.language?.selected ?? 'en'); // Default to 'en' if no language is selected

  const scrollContainerRef = useRef(null); // Ref for the scrollable container

  const { refetch: refetchSignUp, loading: loadingSignUp, data: dataSignUp } = useGet({
    url: 'https://Flakybcknd.food2go.online/api/customer_login',
  });
  const { refetch: refetchMaintenance, loading: loadingMaintenance, data: dataMaintenance } = useGet({
    url: 'https://Flakybcknd.food2go.online/api/business_setup',
  });

  const { refetch: refetchProducts, loading: loadingProducts, data: dataProducts } = useGet({
    url: `https://Flakybcknd.food2go.online/customer/home/web_products?locale=${selectedLanguage}`,
  });

  const { refetch: refetchCheckOutDetails, loading: loadingCheckOutDetails, data: dataCheckOutDetails } = useGet({
    url: 'https://Flakybcknd.food2go.online/customer/order_type',
  });

  const { refetch: refetchBannerData, loading: loadingBannerData, data: dataBanner } = useGet({
    url: 'https://Flakybcknd.food2go.online/customer/home/slider',
  });

  const { refetch: refetchBranchData, loading: loadingBranchData, data: dataBranch } = useGet({
    url: 'https://Flakybcknd.food2go.online/customer/order_type',
  });

  const { refetch: refetchLocations, loading: loadingLocationsData, data: dataLocations } = useGet({
    url: 'https://Flakybcknd.food2go.online/customer/address',
    required: true,
  });

  const { refetch: refetchLanguage, loading: loadingLanguageData, data: dataLanguages } = useGet({
    url: 'https://Flakybcknd.food2go.online/customer/home/translation',
  });

  useEffect(() => {
    refetchSignUp();
  }, [refetchSignUp]);

  useEffect(() => {
    refetchMaintenance();
  }, [refetchMaintenance]);

  useEffect(() => {
    refetchProducts();
  }, [refetchProducts]);

  useEffect(() => {
    refetchBranchData();
  }, [refetchBranchData]);

  useEffect(() => {
    refetchLocations();
  }, [refetchLocations]);

  useEffect(() => {
    refetchLanguage();
  }, [refetchLanguage]);

  useEffect(() => {
    if (user) {
      console.log('User authenticated, triggering refetch:', user);
      refetchCheckOutDetails();
    } else {
      console.log('User is not authenticated, skipping refetch');
    }
  }, [user, refetchCheckOutDetails]);

  useEffect(() => {
    refetchBannerData();
  }, [refetchBannerData]);

  useEffect(() => {
    if (dataSignUp && dataSignUp.customer_login) {
      dispatch(setSignUpType(dataSignUp.customer_login));
      console.log('Fetched song from API At App:', dataSignUp.customer_login);
    }
  }, [dataSignUp, dispatch]);

  useEffect(() => {
    if (dataMaintenance && dataMaintenance) {
      // dispatch(setSignUpType(dataMaintenance));
      console.log('Fetched Maintenance:', dataMaintenance);
    }
  }, [dataMaintenance]);

  // useEffect(() => {
  //   if (dataProducts && dataProducts.products) {
  //       console.log(dataProducts)
  //     dispatch(setTaxType(dataProducts?.tax || null));
  //     dispatch(setProducts(dataProducts?.products || null));
  //     dispatch(setProductsFilter(dataProducts?.products || null));
  //     dispatch(setCategories(dataProducts?.categories || null));
  //     dispatch(setProductsDiscount(dataProducts?.discounts || null));
  //     dispatch(setProductsDiscountFilter(dataProducts?.discounts || null));

  //     // console.log('Fetched ProddataProducts:', dataProducts);
  //   }
  // }, [dataProducts]);

  useEffect(() => {
    if (dataCheckOutDetails && dataCheckOutDetails.payment_methods) {

      dispatch(setCheckOutDetails(dataCheckOutDetails));

      console.log('Fetched dataCheckOutDetails:', dataCheckOutDetails);
    }
  }, [dataCheckOutDetails]);

  /* Scroll to Top when page changes */
  useEffect(() => {
    if (location.pathname && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, [location.pathname]);

  useEffect(() => {
    if (dataBanner && dataBanner.banners) {
      dispatch(setBanners(dataBanner?.banners));
      console.log('Fetched Banners:', dataBanner);
    }
  }, [dataBanner]);

  useEffect(() => {
    if (dataBranch && dataBranch.branches) {
      dispatch(setBranch(dataBranch.branches));
      console.log('Fetched Branches:', dataBranch.branches);
    }
  }, [dataBranch]);

  useEffect(() => {
    if (dataLocations && dataLocations.addresses) {
      dispatch(setLocations(dataLocations.addresses));
      console.log('Fetched Locations:', dataLocations.addresses);
    }
  }, [dataLocations]);

  useEffect(() => {
    if (dataLanguages && dataLanguages.translation) {
      dispatch(setLanguageData(dataLanguages.translation)); // this triggers setLanguageData reducer
      console.log('Fetched Languages:', dataLanguages);
    }
  }, [dataLanguages]);

  return (
    <PrimeReactProvider>
      {loadingSignUp || loadingProducts || loadingCheckOutDetails || loadingBannerData ||loadingBranchData || loadingLocationsData || loadingLanguageData? (
        <div className="w-full h-screen flex justify-center items-center">
          <LoaderLogin />
        </div>
      ) : (
        <div
          ref={scrollContainerRef}
          className='relative w-full bg-white flex flex-col items-center justify-between h-screen overflow-y-scroll overflow-x-hidden'>
          <div className="sticky top-0 w-full z-30">
            <Navbar />
          </div>
          {/* Main Content Area */}
          <div className="w-full mb-5">
            <Outlet />
          </div>
          <Footer />
        </div>
      )}
    </PrimeReactProvider>
    // <MaintenancePage />
  );
};

export default App;
