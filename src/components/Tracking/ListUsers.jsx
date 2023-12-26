import React, {Fragment} from 'react';
import {Menu, Transition} from "@headlessui/react";
import {ChevronDownIcon} from "@heroicons/react/24/solid";
import {map, size} from "lodash/collection";

const ListUsers = ({users}) => {
    return (<Menu as="div" className="inline-block text-left z-10 relative ">
            <div>
                <Menu.Button
                    className="inline-flex w-full justify-center rounded-md bg-green-300 px-4 py-2 text-sm font-medium text-white hover:bg-green-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
                    <ChevronDownIcon
                        className="h-5 w-5 text-green-500 hover:text-green-100"
                        aria-hidden="true"
                    />
                </Menu.Button>
            </div>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items
                    className="absolute -ml-0 w-max divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                    <div className="px-1 py-1 ">
                        {users && size(users) > 0 && map(users, (user, index) => (

                            <Menu.Item key={index}>
                                {({active}) => (<button
                                    className={`${active ? 'bg-green-300 text-white' : 'text-gray-900'} group flex w-full  items-center rounded-md px-2 py-2 text-xs`}
                                >
                                    {user.name}
                                </button>)}
                            </Menu.Item>))}
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>

    );
};

export default ListUsers;

