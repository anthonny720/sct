import React from 'react';
import {Disclosure, Transition} from "@headlessui/react";
import {BuildingOfficeIcon, MinusIcon, PlusIcon} from "@heroicons/react/24/solid";
import {UserIcon} from "@heroicons/react/20/solid";
import {map, size} from "lodash/collection";

const Tree = ({items}) => {
    return (<div>
        {items && true && true && size(items) > 0 && map(items, i => (<Disclosure as="div">
            {({open}) => (<>
                <Disclosure.Button
                    className="flex w-full mt-4 justify-start gap-2 border-b-2 -z-10  items-center  bg-white px-4 py-2 text-left text-sm font-medium text-black hover:bg-blue-600 hover:bg-opacity-10 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                    {i?.children?.length > 0 && !open ? <PlusIcon
                            className={"h-6 w-6 bg-gray-400 text-green-600  bg-opacity-20 rounded-full hover:bg-white "}/> :

                        <MinusIcon
                            className={` h-6 w-6 bg-gray-400 text-white-400  bg-opacity-10 rounded-full hover:bg-white`}/>}
                    <BuildingOfficeIcon
                        className={`h-5 w-5 text-gray-600 `}
                    />
                    <p>
                        <span className={"font-normal font-sans text-xs"}>{i?.name} ({size(i?.children)})</span>
                        <br/>
                        <span
                            className={"font-normal text-gray-400 font-sans text-[10px]"}>{"// GREENBOX/"}</span>
                    </p>

                </Disclosure.Button>
                <Transition
                    show={open}
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                >
                    {map(i?.children, j => {
                        return <Disclosure.Panel
                            className="flex w-full -z-10   justify-start gap-2 border-b-2  items-center  bg-white pl-16  py-2 text-left text-sm font-medium text-black hover:bg-blue-600 hover:bg-opacity-10 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                            <UserIcon
                                className={`h-5 w-5 text-gray-500 `}
                            />
                            <p>
                                <span className={"font-normal font-sans text-xs"}>{j.name}</span>
                                <br/>
                                <span
                                    className={"font-normal text-gray-400 font-sans text-[10px]"}>{"// GREENBOX/ "}{i?.name}/{j?.position}</span>
                            </p>
                        </Disclosure.Panel>
                    })}

                </Transition>
            </>)}
        </Disclosure>))}
    </div>);
}

export default Tree;
