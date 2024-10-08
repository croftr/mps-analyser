// @ts-nocheck
"use client";

import { ReactSearchAutocomplete } from 'react-search-autocomplete';
import { useState, useEffect } from 'react';
import { config } from '../../app/app.config';
import ky from 'ky';
import { useMpStore } from '@/lib/store';
import { useRouter } from 'next/navigation'
import DivisionSvg from '../custom/divisionSvg';
import MpSvg from '../custom/mpSvg';

const EARLIEST_FROM_DATE = "2003-11-12";

export default function Search() {

    const router = useRouter()
    const [mpNames, setMpNames] = useState([]);
    const [divisionNames, setDivisionNames] = useState([]);
    
    const getMpNames = async () => {
        const result = await ky(`${config.mpsApiUrl}mpnames`).json();
        setMpNames(result);
    }

    const getDivisionNames = async () => {
        const result = await ky(`${config.mpsApiUrl}divisionnames`).json();
        setDivisionNames(result);
    }

    useEffect(() => {
        getMpNames();
        getDivisionNames();
    }, []);


    const handleOnSearch = () => {
        console.log("handleOnSearch");
    }

    const handleOnHover = () => {        
        console.log("handleOnHover");
    }

    const handleOnSelect = async (item: any) => {
        console.log("handle select ", item);
            
    
        let result;
        if (item.type === 'mp') {
            result = await ky(`https://members-api.parliament.uk/api/Members/${item.id}`).json();
        } else {
            result = await ky(`https://commonsvotes-api.parliament.uk/data/division/${item.id}.json`).json();
        }

        if (result) {
            if (result?.value?.gender) {                            
                router.push(`/mp?id=${item.id}`, { scroll: true });
            } else {
                router.push(`/division?id=${item.id}`, { scroll: true });                
            }
        }
    }

    const handleOnFocus = () => { }

    const formatResult = (item) => {
        const icon = item.type === 'mp' ? <MpSvg className='fill-slate-900'/> : <DivisionSvg className='fill-slate-900' />            
        return (
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', overflowX: 'auto' }}>
                <span>{icon}</span>
                <span style={{ display: 'block', textAlign: 'left', marginLeft: 8 }}>{item.name}</span>
            </div>
        )
    }

    return (
        <div className="p-2 pl-4 pr-4 mt-1 lg:mt-10 xg:mt-10 2xl:mt-10">
            <ReactSearchAutocomplete                
                placeholder='Search MPs or Divisions'
                styling={{ zIndex: 1 }}
                items={mpNames.concat(divisionNames)}                
                onSearch={handleOnSearch}
                onHover={handleOnHover}
                onSelect={handleOnSelect}
                onFocus={handleOnFocus}
                maxResults={100}
                showIcon={false}              
                formatResult={formatResult}              
            />

        </div>
    );
}
