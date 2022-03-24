import { ChevronRightIcon } from '@heroicons/react/solid';
import RatingStarsView from '../components/ratingStarsView';

export default function DoctorRow(props) {
  return (
    <div className="flex items-center px-4 py-4 sm:px-6">
      <div className="min-w-0 flex-1 flex items-center">
        <div className="flex-shrink-0">
          <img className="h-20 w-20 rounded-full" src={props.doctor.imageUrl || '/images/placeholder-user.png'} alt="" />
        </div>
        <div className="min-w-0 flex-1 px-4">
            <p className="text-base font-medium text-darkBlue truncate">{props.doctor.firstName + ' ' + props.doctor.lastName}</p>
            <p className="mt-1 text-sm font-light text-darkBlue truncate">{props.doctor.emailAddress}</p>
            { props.doctor.practice &&
              <p className="mt-1 text-sm font-light text-gray-600 truncate">{props.doctor.practice.addressLine1} {props.doctor.practice.addressLine2} {props.doctor.practice.city}, {props.doctor.practice.state} {props.doctor.practice.postalCode}</p>
            }
            <div className="mt-1 flex">
              <RatingStarsView doctor={props.doctor} />
            </div>
        </div>
      </div>
      <div>
        <ChevronRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </div>
    </div>
  )
}