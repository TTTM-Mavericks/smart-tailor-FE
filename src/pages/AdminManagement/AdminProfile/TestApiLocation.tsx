import React, { useState, useEffect } from 'react';

import VNLocationData from '../../../locationData.json'

const ProvinceComponent = () => {
    const [locations, setLocations] = useState<any[]>([]);
    const [selectedProvince, setSelectedProvince] = useState<any>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<any>(null);
    const [selectedWard, setSelectedWard] = useState<any>(null);

    useEffect(() => {
        Promise.resolve(VNLocationData)
            .then(data => setLocations(data))
            .catch(err => console.log("err ", err));

    }, []);



    const handleProvinceChange = (event: any) => {
        const provinceName = event.target.value;
        const selectedProvince = locations.find((location: any) => location.Name === provinceName);
        setSelectedProvince(selectedProvince);
        setSelectedDistrict(null);
        setSelectedWard(null);
    };

    const handleDistrictChange = (event: any) => {
        const districtName = event.target.value;
        const selectedDistrict = selectedProvince.Districts.find((district: any) => district.Name === districtName);
        setSelectedDistrict(selectedDistrict);
        setSelectedWard(null);
    };

    const handleWardChange = (event: any) => {
        const wardName = event.target.value;
        const selectedWard = selectedDistrict.Wards.find((ward: any) => ward.Name === wardName);
        setSelectedWard(selectedWard);
    };

    return (
        <div>
            <select onChange={handleProvinceChange}>
                <option>Select Province</option>
                {locations.map((location: any) => (
                    <option key={location.Name}>{location.Name}</option>
                ))}
            </select>
            {selectedProvince && (
                <select onChange={handleDistrictChange}>
                    <option>Select District</option>
                    {selectedProvince.Districts.map((district: any) => (
                        <option key={district.Name}>{district.Name}</option>
                    ))}
                </select>
            )}
            {selectedDistrict && (
                <select onChange={handleWardChange}>
                    <option>Select Ward</option>
                    {selectedDistrict.Wards.map((ward: any) => (
                        <option key={ward.Name}>{ward.Name}</option>
                    ))}
                </select>
            )}
        </div>
    );
};

export default ProvinceComponent;
