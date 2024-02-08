import React from 'react';
import PopoverMe from "./Profile";

const Header = () => {
    return (<div className="bg-white shadow-sm w-full  z-[100] rounded-xl">
            <div
                className="max-w-full mx-auto h-11 px-4 flex items-center justify-around sm:px-6 lg:px-8 z-[100]">
                {/* Currency selector */}
                <form className="hidden lg:block lg:flex-1 ">
                    <div className="flex items-center text-black">
                        <i className='mt-0.5 mr-1 text-gray-500 '></i>
                        <span className=' text-xs font-bold'>+51 982 704 759</span>
                        <span className="h-6 w-px bg-white  mx-2" aria-hidden="true"/>
                        <i className=' mt-0.5 mr-1 text-gray-500 '></i>
                        <span className=' text-xs font-bold'>data.analyst@greenbox.pe</span>
                    </div>
                </form>

                <div className="text-center text-sm font-gilroy-medium text-white z-[100]">
                    <PopoverMe/>
                </div>

            </div>
        </div>

    );
};

export default Header;
