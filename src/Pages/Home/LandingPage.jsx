import React, { useEffect, useState } from 'react'
import { FiHome } from "react-icons/fi";
import { MdWork } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux'
import { UpdateOrder } from '../../Store/CreateSlices';
import AddButton from '../../Components/Buttons/AddButton';
import { useNavigate, Link } from 'react-router-dom';
import { useDelete } from '../../Hooks/useDelete';
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { PiWarningCircle } from "react-icons/pi";
import { MdDeliveryDining } from "react-icons/md";
import { GiMeal } from "react-icons/gi";
import FlakyLogo from '../../assets/Images/FlakyLogo.jpeg'
import { HeaderNavigate, LoaderLogin, StaticSpinner, SubmitButton } from '../../Components/Components'
import {setPickupLoctaion,setCategories, setProducts, setProductsDiscount, setProductsDiscountFilter, setProductsFilter, setTaxType} from './../../Store/CreateSlices';
import { useGet } from '../../Hooks/useGet';
import { useAuth } from '../../Context/Auth'

// Import your fetchLocations thunk action
import { setLocations } from '../../Store/CreateSlices';
const LandingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
    const auth = useAuth();
  const order = useSelector(state => state?.order?.data || {});
  const products = useSelector(state => state?.productsCard?.data || []);
  const total = useSelector(state => state?.totalPrice?.data || 0);
  const { deleteData, loadingDelete, responseDelete } = useDelete();
  const [openDelete, setOpenDelete] = useState(null);

  const orderTypes = useSelector(state => state.checkOutDetails?.data?.order_types || []);
  const allBranches = useSelector(state => state.checkOutDetails?.data?.branches || []);
  const allLocations = useSelector(state => state.location.data || []);
  const [orderTypeSelected, setOrderTypeSelected] = useState(orderTypes[0]?.type || '');
  const [orderTypeId, setOrderTypeId] = useState(orderTypes[0]?.id || null);

  const [brancheId, setBrancheId] = useState('');
  const [locationId, setLocationId] = useState('');
  const [deliveryPrice, setDeliveryPrice] = useState('');
  const [canNavigate, setCanNavigate] = useState(false);
  
  // 1. Fetch products AFTER valid selection
  const key = brancheId ? 'branch_id' : 'address_id';
  const value = brancheId || locationId;
  
  const {
    refetch: refetchProducts,
    loading: loadingProducts,
    data: dataProducts
  } = useGet({
    url: `https://Flakybcknd.food2go.online/customer/home/web_products?${key}=${value}`,
    skip: !value // only fetch when value exists
  });
  
  useEffect(() => {
    if (value && value !== '') {
      dispatch(setPickupLoctaion(value));
      refetchProducts(); // call after valid selection
    }
  }, [value]);
  
  useEffect(() => {
    if (dataProducts && value !== '') {
      dispatch(setTaxType(dataProducts?.tax || null));
      dispatch(setProducts(dataProducts?.products || null));
      dispatch(setProductsFilter(dataProducts?.products || null));
      dispatch(setCategories(dataProducts?.categories || null));
      dispatch(setProductsDiscount(dataProducts?.discounts || null));
      dispatch(setProductsDiscountFilter(dataProducts?.discounts || null));
      setCanNavigate(true); // allow navigation after setting products
    }
  }, [dataProducts]);
  
  // 2. Handle delivery type logic + redirect to login if not authenticated
  useEffect(() => {
    if ((orderTypeSelected === 'delivery' || orderTypeId === 3) && !auth.user) {
      navigate('/auth/login', { replace: true });
    }
  }, [orderTypeSelected, orderTypeId, auth.user]);

  
  // 4. Selection Handlers
  const handleSelectBranch = (branch) => {
    setBrancheId(branch.id);
    setDeliveryPrice('');
    setLocationId('');
  };
  
  const handleSelectLocation = (location) => {
    setLocationId(location.id);
    setDeliveryPrice(location?.zone?.price || '');
    setBrancheId('');
  };  
  
  // 3. Centralized function to navigate only when valid
  useEffect(() => {
    if (canNavigate && !loadingProducts && (brancheId || locationId)) {
      navigate("/menu");
    } 
  }, [canNavigate, brancheId, locationId]);

  useEffect(() => {
    if (orderTypes.length > 0) {
      console.log("orddd", orderTypes);
      setOrderTypeSelected(orderTypes[0].type);
      setOrderTypeId(orderTypes[0].id);
    }
  }, [orderTypes]);

//   useEffect(() => {
//     if ((orderTypeSelected === 'delivery' || orderTypeId === 3) && !auth.user) {  
//             navigate('/auth/login', { replace: true })
//      }    
//     }, [orderTypeSelected,orderTypeId]);

  useEffect(() => { console.log('locations', allLocations) }, [allLocations]);
  useEffect(() => { console.log('orderTypeSelected', orderTypeSelected) }, [orderTypeSelected]);
  useEffect(() => { console.log('orderTypeId', orderTypeId) }, [orderTypeId]);
  useEffect(() => { console.log('brancheId', brancheId) }, [brancheId]);
  useEffect(() => { console.log('allLocations', allLocations) }, [allLocations]);

  useEffect(() => {
    dispatch(UpdateOrder({
      ...order,
      order_type: orderTypeSelected,
      branch_id: brancheId,
      address_id: locationId,
      delivery_price: deliveryPrice,
      amount: Number(total) + Number(deliveryPrice || 0),
    }));
  }, [orderTypeId, brancheId, locationId]);

  const handleAddAddress = () => {
    navigate("/check_out/add_address"); // Update with your actual route
  };

  const handleOpenDelete = (item) => {
    setOpenDelete(item);
  };
  const handleCloseDelete = () => {
    setOpenDelete(null);
  };

  // Delete location and then refetch locations
    const handleDelete = async (id, name) => {
       const success = await deleteData(`https://Flakybcknd.food2go.online/customer/address/delete/${id}`, `${name} Deleted Success.`);
       if (success) {
         // Filter out the deleted location and update the Redux state
         const updatedLocations = allLocations.filter(location => location.id !== id);
         dispatch(setLocations(updatedLocations));
       }
       };

       if(loadingProducts){
        return <StaticSpinner/>
       }

  return (
    <>
    <div className='w-full flex flex-col gap-3 mb-5'>
        <div className="w-full flex flex-col lg:flex-row gap-5 p-4">

            {/* Navbar Type Order */}
            <div className="w-full lg:w-1/2 flex flex-col gap-5 items-center justify-center gap-x-3 pt-4 md:p-6">
                <h1 className='text-2xl font-semibold'>PickUP Or Delivery</h1>

                <div className="w-full flex justify-center items-center gap-x-4 md:gap-x-6">
                    {orderTypes.map((type) => (
                    type.status === 1 && (
                        <span
                        key={type.id}
                        className={`flex min-w-40 h-40 flex-col items-center justify-center gap-2 text-xl font-TextFontRegular px-4 py-2 rounded-lg cursor-pointer border-2 transition-all ease-in-out duration-300
                            ${orderTypeSelected === type.type ?'text-mainColor border-mainColor hover:border-[#F6E7E7] bg-white hover:bg-[#F6E7E7] hover:text-mainColor' : 'text-mainColor bg-[#F6E7E7] border-[#F6E7E7]'}`}
                        onClick={() => {
                            setOrderTypeSelected(type.type);
                            setOrderTypeId(type.id);
                        }}
                        >
                        {/* Display appropriate icon based on type */}
                        {type.type.charAt(0).toUpperCase()+ type.type.slice(1) === "Delivery" ? <MdDeliveryDining size={64} /> : null}
                        {type.type.charAt(0).toUpperCase()+ type.type.slice(1) === "Take_away" ? <GiMeal size={64} /> : null}

                        {type.type.charAt(0).toUpperCase() + type.type.slice(1)}
                        </span>
                    )
                    ))}
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex flex-col gap-5 justify-center gap-x-3">
            {/* Add New Address button */}
            {/* {orderTypeId === 3 && (
            <div className='w-full flex justify-center'>
                <AddButton handleClick={handleAddAddress} text="Add New Address" BgColor='mainColor' Color='white' iconColor='white' />
            </div>
            )} */}

            {/* Locations */}
            {orderTypeId === 3 && (
            <>
                <h1 className='text-2xl font-semibold'>Select Address</h1>
                <div className='w-full flex justify-end'>
                <AddButton handleClick={handleAddAddress} text="Add New Address"  Color='mainColor' iconColor='mainColor' />
                </div>
                <div className="w-full max-w-6xl mx-auto grid grid-cols-1 xl:grid-cols-1 gap-3 max-h-[400px] overflow-y-auto">
                {allLocations.map((location) => (
                    <div key={location.id} className="relative">
                        <div
                        onClick={() => {
                            handleSelectLocation(location);
                          }}                          
                        className={`group w-full flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all duration-300 shadow-sm 
                            ${locationId === location.id 
                            ? 'bg-mainColor text-white ' 
                            : 'bg-gray-100 text-black hover:bg-mainColor hover:text-white hover:border-mainColor'}`}
                        >
                        <div className="flex-shrink-0 p-2 bg-mainColor rounded-md group-hover:bg-mainColor transition">
                            {location.type === 'Home' ? (
                            <FiHome className="w-6 h-6 text-white" />
                            ) : (
                            <MdWork className="w-6 h-6 text-white" />
                            )}
                        </div>

                        <div className="flex flex-col text-sm w-full space-y-1">
                            <p className="font-semibold line-clamp-1">
                            {location.address?.charAt(0).toUpperCase() + location.address?.slice(1)}
                            </p>
                            <p className="text-xs line-clamp-1">
                            <strong>Bldg:</strong> {location.building_num || '-'} &nbsp; | &nbsp;
                            <strong>Floor:</strong> {location.floor_num || '-'} &nbsp; | &nbsp;
                            <strong>Apt:</strong> {location.apartment || '-'}
                            </p>
                            <p className="text-xs line-clamp-1">
                            <strong>Extra:</strong> {location.additional_data || '-'}
                            </p>

                            <div className="flex justify-between items-center pt-2 border-t border-gray-200 mt-2">
                            <span className="text-xs font-medium">Zone Price: {location?.zone?.price || '-'}</span>
                            <button
                                onClick={(e) => {
                                e.stopPropagation();
                                handleOpenDelete(location.id);
                                }}
                                className="transition hover:text-white"
                            >
                                <MdDelete size="18"/>
                            </button>
                            </div>
                        </div>
                        </div>

                        {openDelete === location.id && (
                        <Dialog open={true} onClose={handleCloseDelete} className="relative z-10">
                            <DialogBackdrop className="fixed inset-0 bg-black/30" />
                            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                            <div className="flex min-h-full items-center justify-center p-4">
                                <DialogPanel className="w-full max-w-sm rounded-xl bg-white shadow-lg">
                                <div className="flex flex-col items-center px-6 py-6">
                                    <PiWarningCircle size="50" className="text-mainColor mb-3" />
                                    <div className="text-center text-gray-800">
                                    Are you sure you want to delete this location?
                                    <div className="mt-1 font-semibold text-sm">{location.address || '-'}</div>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 px-6 pb-4">
                                    <button
                                    className="bg-mainColor hover:bg-mainColor/90 text-white text-sm py-2 px-4 rounded-lg transition"
                                    onClick={() => handleDelete(location.id, location?.address)}
                                    >
                                    Delete
                                    </button>
                                    <button
                                    onClick={handleCloseDelete}
                                    className="bg-gray-100 text-sm text-gray-700 hover:bg-gray-200 py-2 px-4 rounded-lg transition"
                                    >
                                    Cancel
                                    </button>
                                </div>
                                </DialogPanel>
                            </div>
                            </div>
                        </Dialog>
                        )}
                    </div>
                    ))}
                </div>
            </>
            )}

            {/* Branches */}
            {(orderTypeId === 1 || orderTypeId === 2) && (
            <div className="w-full flex flex-col items-start justify-evenly gap-3">
                <h1 className='text-2xl font-semibold'>Select Branch</h1>
                <div className="w-full max-h-[400px] overflow-y-auto flex flex-col gap-3">
                {allBranches.map((branche) => (
                <div
                    key={branche.id}
                    className={`w-full flex items-center justify-start gap-x-3 text-xl font-TextFontRegular px-3 py-3 rounded-xl cursor-pointer transition-all ease-in-out duration-300
                    ${brancheId === branche.id ? 'text-white bg-mainColor ' : 'text-black bg-gray-100 hover:bg-mainColor hover:text-white'}`}
                    onClick={() => {
                        handleSelectBranch(branche);
                      }}                      
                >
                    <img
                    src={branche?.image_link || ''}
                    alt={branche?.name || 'Branch Image'}
                    className={`w-14 h-14 md:w-20 md:h-20 rounded-full object-cover object-center`}
                    />
                    <div className="flex flex-col items-start justify-center">
                    <span className='sm:text-lg xl:text-xl font-TextFontRegular'>
                    {branche.name.charAt(0).toUpperCase() + branche.name.slice(1)}
                    </span>
                    <span className='sm:text-xs xl:text-lg font-TextFontRegular'>
                        {branche.address.charAt(0).toUpperCase() + branche.address.slice(1)}
                    </span>
                    </div>
                </div>
                ))}
                </div>
            </div>
            )}
            </div>
        </div>
{/* 
        <div className="w-full flex items-center justify-center">
                {(brancheId || locationId) && (
            <div>
                <SubmitButton handleClick={GoToMenu} text={'Done'} px="px-20" />
            </div>
        )}

        </div> */}
    </div>
    </>
  );
};

export default LandingPage;
