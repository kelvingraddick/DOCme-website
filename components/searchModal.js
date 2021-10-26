import { Fragment, useState } from 'react';
import { Dialog, Menu, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
import { DotsVerticalIcon } from '@heroicons/react/solid';
import Colors from '../constants/colors';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function SearchModal(props) {
  return (
    <Transition.Root show={props.open} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 overflow-hidden" onClose={props.onCancelButtonPress}>
        <div className="absolute inset-0 overflow-hidden">
          <Dialog.Overlay className="absolute inset-0" />

          <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex sm:pl-16">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="w-screen max-w-md">
                <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-start justify-between">
                      <Dialog.Title className="text-lg font-medium text-gray-900">{props.title}</Dialog.Title>
                      <div className="ml-3 h-7 flex items-center">
                        <button
                          type="button"
                          className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500"
                          onClick={props.onCancelButtonPress}
                        >
                          <span className="sr-only">Close panel</span>
                          <XIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                  { props.onSearchBoxChangeText &&
                    <div className="px-1 py-2 border-b border-gray-200">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        className="block w-full border-0 border-transparent focus:ring-0 sm:text-sm"
                        placeholder={props.placeholder}
                        onChange={(input) => props.onSearchBoxChangeText(input.target.value)}
                      />
                    </div>
                  }
                  <ul role="list" className="flex-1 divide-y divide-gray-200 overflow-y-auto">
                    {props.options.map((option) => (
                      <li key={option.id} onClick={() => props.onOptionSelected(option)} className="border-b border-gray-200">
                        <div className="relative group py-4 px-4 flex items-center">
                          <div className="flex-1 flex items-center min-w-0 relative">
                            <span className="flex-shrink-0 inline-block relative sm:text-sm">
                              {option.name}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}