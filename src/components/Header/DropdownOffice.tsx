'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import ClickOutside from "@/components/ClickOutside";
import axios from "axios";

const DropdownOffice = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [branchList, setBranchList] = useState<any>([]);
    const [selectBranch, setSelectBranch] = useState<any>();

    useEffect(() => {
        const storedBranch = localStorage.getItem("selectedBranch");
        if (storedBranch) {
            setSelectBranch(JSON.parse(storedBranch));
        }

        const fetchResults = async () => {
            try {
                const response = await axios.get("https://api-jennifer-wkeor.ondigitalocean.app/apimedical3/api/branch-office/list/active", {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                    }
                });
                const branches = response.data.branchOffices;
                setBranchList(branches);

                if (!storedBranch && branches.length > 0) {
                    setSelectBranch(branches[0]);
                    localStorage.setItem("selectedBranch", JSON.stringify(branches[0]));
                }
            } catch (error) {
                console.error("Error fetching branch-office:", error);
            }
        };

        fetchResults();
    }, []);

    const selectedOffice = (office: any) => {
        setSelectBranch(office);
        setDropdownOpen(false);
        localStorage.setItem("selectedBranch", JSON.stringify(office));
    };

    return (
        <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
            <Link
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-4"
                href="#"
            >
                <span className="hidden text-right lg:block">
                    <span className="block text-sm font-medium text-black dark:text-white">
                        {selectBranch?.nameBranchOffice || "No ha seleccionado sucursal"}
                    </span>
                    <span className="block text-xs">{selectBranch?.address}</span>
                </span>

                <svg
                    className="hidden fill-current sm:block"
                    width="12"
                    height="8"
                    viewBox="0 0 12 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08924L6.58928 7.08924C6.26384 7.41468 5.7362 7.41468 5.41077 7.08924L0.410765 2.08924C0.0853277 1.76381 0.0853277 1.23617 0.410765 0.910734Z"
                        fill=""
                    />
                </svg>
            </Link>

            {dropdownOpen && (
                <div
                    className={`absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark`}
                >
                    {branchList.map((result: any, index: any) => (
                        <ul key={index} className="flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark">
                            <li onClick={() => selectedOffice(result)}>
                                <span className="text-sm font-semibold">{result.nameBranchOffice}</span>
                            </li>
                        </ul>
                    ))}
                </div>
            )}
        </ClickOutside>
    );
};

export default DropdownOffice;