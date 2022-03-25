import React from 'react';
import { StarIcon } from '@heroicons/react/solid';
import Moment from 'moment';
import Layout from '../../../components/layout';
import DoctorRow from '../../../components/doctorRow';

export async function getServerSideProps(context) {
  var ratings = await fetch('http://www.docmeapp.com/rating/doctor/' + context.query.id + '/list/', { method: 'GET' })
  .then((response) => { 
    if (response.status == 200) {
      return response.json()
      .then((responseJson) => {
        if (responseJson.isSuccess) {
          return responseJson.ratings;
        }
      })
    }
    return [];
  })
  .catch((error) => {
    console.error(error);
    return [];
  });

  return {
    props: {
      ratings
    }
  }
}

export default function DoctorRatings(props) {

  return (
    <Layout>
      <div className="px-4 pt-1 sm:px-0 min-h-screen">
        { props.ratings.length > 0 &&
          <div className="bg-white shadow sm:rounded-lg mt-4 mb-2">
            <DoctorRow doctor={props.ratings[0].doctor} />
          </div>
        }
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            {props.ratings.map((rating) => (
              <li key={rating.id}>
                <div className="flex items-center px-4 py-4 sm:px-6">
                  <div className="min-w-0 flex-1 flex items-center">
                    <div className="flex-shrink-0">
                      <img className="h-20 w-20 rounded-full" src={rating.patient.imageUrl || '/images/placeholder-user.png'} alt="" />
                    </div>
                    <div className="min-w-0 flex-1 px-4">
                        <p className="text-base font-medium text-darkBlue truncate">{rating.patient.firstName + ' ' + rating.patient.lastName}</p>
                        <p className="text-sm font-light text-darkBlue truncate">{Moment(rating.timestamp).format('dddd, MMMM Do') + ', ' + Moment(rating.timestamp).format('h:mma')}</p>
                        <div className="flex mt-1">
                          {
                            [1, 2, 3, 4, 5].map((ratingValue) => {
                                let starColor = rating.value >= ratingValue ? 'text-green' : 'text-lightGray';
                                return <StarIcon className={'h-5 w-5 ' + starColor} aria-hidden="true" />
                              }
                            )
                          }
                        </div>
                        { rating.notes &&
                          <p className="mt-1 text-sm font-light text-gray-600">{rating.notes}</p>
                        }
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  )
}
