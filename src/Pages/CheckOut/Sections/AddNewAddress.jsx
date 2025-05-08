import React, { useEffect, useRef, useState } from 'react';
import { DropDown, NumberInput, StaticButton, StaticSpinner, SubmitButton, Switch, TextInput } from '../../../Components/Components';
import { usePost } from '../../../Hooks/usePost';
import { useAuth } from '../../../Context/Auth';
import { useSelector } from 'react-redux';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { FiHome, FiMapPin } from 'react-icons/fi';
import { MdWork } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from "react-icons/io";
import { useGet } from '../../../Hooks/useGet';
const AddNewAddress = ({ update, setUpdate }) => {
  const { postData, loadingPost, response } = usePost({ url:`https://Flakybcknd.food2go.online/customer/address/add` });
  const { refetch: refetchLocations, loading: loadingLocationsData, data: dataLocations } = useGet({
    url: 'https://Flakybcknd.food2go.online/customer/address',
    required: true,
  });
  // const allZones = [];
  const [zones, setZones] = useState([]);

  const [allZones, setAllZones] = useState([]);

  useEffect(() => {
    refetchLocations();
  }, [refetchLocations]);
  useEffect(() => {
    if (dataLocations && dataLocations.zones) {
      setZones(
        dataLocations.zones.map(zone => ({
          id: zone.id,
          name: zone.zone // Ensure this is the correct property name
        }))
      );
    }

  }, [dataLocations]);  

  const allLocations = useSelector(state => state.location.data || []);

  const dropDownZones = useRef();
  const auth = useAuth();
    const navigate = useNavigate();

  const [stateZone, setStateZone] = useState('Select Zone');
  const [zoneId, setZoneId] = useState('');
  const [isOpenZone, setIsOpenZone] = useState(false);

  const [street, setStreet] = useState('');
  const [buildingNo, setBuildingNo] = useState('');
  const [floorNo, setFloorNo] = useState('');
  const [apartment, setApartment] = useState('');
  const [moreData, setMoreData] = useState('');

  // New state for address type (home, work, other)
  const [addressType, setAddressType] = useState('home');

  // State for user location and location name
  const [userLocation, setUserLocation] = useState(null);
  const [locationName, setLocationName] = useState('');

  // Attempt to get user location automatically using the Geolocation API on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(loc);
        },
        (error) => {
          console.error('Error fetching location', error);
          // If geolocation fails, user can manually enter location below
        }
      );
    }
  }, []);

  // If userLocation exists, attempt to reverse geocode it to get a human-readable name (Arabic preferred)
  useEffect(() => {
    if (userLocation) {
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${userLocation.lat}&lon=${userLocation.lng}&accept-language=ar`)
        .then(res => res.json())
        .then(data => {
          if (data.display_name) {
            setLocationName(data.display_name);
          } else {
            setLocationName('Selected Address');
          }
        })
        .catch(err => {
          console.error("Error fetching location name", err);
          setLocationName('Selected Address');
        });
    }
  }, [userLocation]);

  // Update zones from redux state
  // useEffect(() => {
  //   if (allZones.length > 0) {
  //     setZones([{ id: '', name: 'Select Zone' }, ...allZones.map(zone => ({
  //       id: zone.id,
  //       name: zone.zone // Ensure correct property name
  //     }))]);
  //   } else {
  //     setZones([{ id: '', name: 'Select Zone' }]);
  //   }
  //   console.log('Zones', allZones);
  // }, []);

  const handleOpenZones = () => {
    setIsOpenZone(!isOpenZone);
  };
  const handleOpenOptionZone = () => setIsOpenZone(false);

  const handleSelectZone = (option) => {
    setZoneId(option.id);
    setStateZone(option.name);
  };
  useEffect(() => {
    if (!loadingPost && response) {
      navigate(-1); // Navigate back first
      setTimeout(() => {
        window.location.reload(); // Reload after a short delay
      }, 300); // 500ms delay to allow navigation to take effect
    }
  }, [loadingPost, response, navigate]);  

  const handleReset = () => {
    setStreet('');
    setBuildingNo('');
    setFloorNo('');
    setApartment('');
    setMoreData('');
    setStateZone('Select Zone');
    setZoneId('');
    setIsOpenZone(false);
    // Do not reset userLocation here so that the map (or manual field) remains
    setAddressType('');
    // Optionally, you may reset locationName if desired:
    // setLocationName('Selected Address');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close dropdown if clicked outside
      if (dropDownZones.current && !dropDownZones.current.contains(event.target)) {
        setIsOpenZone(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleZoneAdd = (e) => {
    e.preventDefault();

    
    if (!locationName) {
        auth.toastError('Please Enter Location');
        return;
    }
    if (!street) {
      auth.toastError('Please Enter Street Name');
      return;
    }
    if (!buildingNo) {
        auth.toastError('Please Enter Building Number');
        return;
    }
    if (!floorNo) {
        auth.toastError('Please Enter Floor Number');
        return;
    }
    if (!zoneId) {
      auth.toastError('Please Select Zone');
      return;
    }
    if (!addressType) {
      auth.toastError('Please select address type: Home, Work, or Other');
      return;
    }

    const formData = new FormData();
    formData.append('address', locationName);
    formData.append('zone_id', zoneId);
    formData.append('street', street);
    formData.append('building_num', buildingNo);
    formData.append('floor_num', floorNo);
    formData.append('apartment', apartment);
    formData.append('additional_data', moreData);
    formData.append('type', addressType);

    postData(formData, 'Address Added Success');
  };

  return (
    <>
      {loadingPost || loadingLocationsData ? (
        <div className="w-full h-56 flex justify-center items-center">
          <StaticSpinner />
        </div>
      ) : (
        <section className="p-4">
          {/* Title */}
          <div className="flex items-center gap-3">
            <IoIosArrowBack 
              className="text-mainColor cursor-pointer hover:scale-110 transition-transform duration-200" 
              size={28} 
              onClick={() => navigate(-1)} 
            />
            <h1 className="text-2xl sm:text-3xl text-mainColor font-semibold">
              Add Address
            </h1>
          </div>
          {/* Form */}
          <form onSubmit={handleZoneAdd}>
            <div>
              {/* Map Section or Manual Location Input */}
              {userLocation ? (
                <div className="p-4">
                  <MapContainer
                    center={userLocation}
                    zoom={13}
                    style={{ height: '200px', width: '100%', position: 'relative', zIndex: 1 }}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={userLocation} />
                  </MapContainer>
                  {/* TextInput displaying the reverse geocoded location name */}
                  <div className="mt-2">
                    <TextInput
                      value={locationName}
                      disabled
                      className="w-full"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-4">
                  {/* Editable TextInput when no user location is available */}
                  <div className="sm:w-full lg:w-[30%] flex flex-col items-start gap-y-1">
                  <span className="text-xl font-TextFontRegular text-thirdColor">Address :</span>
                  <TextInput
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="Enter your location manually"
                  />
                </div>
                </div>
              )}

              {/* Address Type Tabs */}
              <div className="flex gap-3 justify-center my-4">
                <div 
                  onClick={() => setAddressType('home')}
                  className={`flex justify-center gap-1 items-center cursor-pointer transition-colors duration-300 px-4 py-2 rounded-full
                    ${addressType === 'home' 
                      ? 'bg-mainColor text-white' 
                      : 'bg-white text-mainColor hover:bg-mainColor hover:text-white'}`}
                >
                  <FiHome className="w-6 h-6 md:w-8 md:h-8" />
                  <span className="mt-1 text-sm">Home</span>
                </div>
                <div 
                  onClick={() => setAddressType('work')}
                  className={`flex justify-center gap-1 items-center cursor-pointer transition-colors duration-300 px-4 py-2 rounded-full
                    ${addressType === 'work' 
                      ? 'bg-mainColor text-white' 
                      : 'bg-white text-mainColor hover:bg-mainColor hover:text-white'}`}
                >
                  <MdWork className="w-6 h-6 md:w-8 md:h-8"/>
                  <span className="mt-1 text-sm">Work</span>
                </div>
                <div 
                  onClick={() => setAddressType('other')}
                  className={`flex justify-center gap-1 items-center cursor-pointer transition-colors duration-300 px-4 py-2 rounded-full
                    ${addressType === 'other' 
                      ? 'bg-mainColor text-white' 
                      : 'bg-white text-mainColor hover:bg-mainColor hover:text-white'}`}
                >
                  <FiMapPin className="w-6 h-6 md:w-8 md:h-8" />
                  <span className="mt-1 text-sm">Other</span>
                </div>
              </div>

              {/* Input Fields */}
              <div className="w-full flex flex-wrap items-center justify-start gap-4 p-4">
                {/* Select Zone */}
                <div className="sm:w-full lg:w-[30%] flex flex-col items-start gap-y-1">
                  <span className="text-xl font-TextFontRegular text-thirdColor">Zones:</span>
                  <DropDown
                    ref={dropDownZones}
                    handleOpen={handleOpenZones}
                    stateoption={stateZone}
                    openMenu={isOpenZone}
                    handleOpenOption={handleOpenOptionZone}
                    onSelectOption={handleSelectZone}
                    options={zones}
                    border={false}
                  />
                </div>
                {/* Street Name */}
                <div className="sm:w-full lg:w-[30%] flex flex-col items-start gap-y-1">
                  <span className="text-xl font-TextFontRegular text-thirdColor">Street Name:</span>
                  <TextInput
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Enter Street Name"
                  />
                </div>
                {/* Building Number */}
                <div className="sm:w-full lg:w-[30%] flex flex-col items-start gap-y-1">
                  <span className="text-xl font-TextFontRegular text-thirdColor">Building Number:</span>
                  <TextInput
                    value={buildingNo}
                    onChange={(e) => setBuildingNo(e.target.value)}
                    placeholder="Enter Building Number"
                  />
                </div>
                {/* Floor Number */}
                <div className="sm:w-full lg:w-[30%] flex flex-col items-start gap-y-1">
                  <span className="text-xl font-TextFontRegular text-thirdColor">Floor Number:</span>
                  <TextInput
                    value={floorNo}
                    onChange={(e) => setFloorNo(e.target.value)}
                    placeholder="Enter Floor Number"
                  />
                </div>
                {/* Apartment */}
                <div className="sm:w-full lg:w-[30%] flex flex-col items-start gap-y-1">
                  <span className="text-xl font-TextFontRegular text-thirdColor">Apartment:</span>
                  <TextInput
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                    placeholder="Apartment"
                  />
                </div>
                {/* Additional Data */}
                <div className="sm:w-full lg:w-[30%] flex flex-col items-start gap-y-1">
                  <span className="text-xl font-TextFontRegular text-thirdColor">Additional Data:</span>
                  <TextInput
                    value={moreData}
                    onChange={(e) => setMoreData(e.target.value)}
                    placeholder="Enter Additional Data"
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="w-full flex items-center justify-end gap-x-4 mt-5">
              <div className="">
                <StaticButton text={'Reset'} handleClick={handleReset} bgColor='bg-transparent' Color='text-mainColor' border={'border-2'} borderColor={'border-mainColor'} rounded='rounded-full' />
              </div>
              <div className="">
                <SubmitButton
                  text={'Submit'}
                  rounded='rounded-full'
                  handleClick={handleZoneAdd}
                />
              </div>

            </div>
          </form>
        </section>
      )}
    </>
  );
};

export default AddNewAddress;
