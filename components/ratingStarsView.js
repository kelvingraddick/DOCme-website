import { StarIcon } from '@heroicons/react/solid';

export default function RatingStarsView(props) {
  return (
    <a href={'/doctor/ratings/?id=' + props.doctor.id} className="flex">
      {
        [1, 2, 3, 4, 5].map((rating) => {
            let starColor = props.doctor.averageRating && props.doctor.averageRating >= rating ? 'text-green' : 'text-lightGray';
            return <StarIcon className={'h-5 w-5 ' + starColor} aria-hidden="true" />
          }
        )
      }
      <p className="ml-1 text-sm font-light text-gray-600">({props.doctor.numberOfRatings})</p>
    </a>
  )
}