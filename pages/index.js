import { SearchIcon } from '@heroicons/react/solid'
import Layout from '../components/layout';
import Colors from '../constants/colors';

export default function Home() {
  return (
    <Layout>
      <div className="px-4 pt-1 sm:px-0">
        <div className="bg-local bg-center bg-cover rounded-lg mb-1 h-96" style={{ backgroundImage: "url('../images/background-1.jpg')" }}></div>
        <div className="form rounded-lg p-6 h-auto">
          <div className="text-center text-2xl text-white font-semibold">
            Welcome to DOCme!
          </div>
          <div className="text-center text-xl text-white">
            Tell us what you need below
          </div>
          <div className="py-6">
            <div>
              <label htmlFor="speciality" className="sr-only">
                Speciality
              </label>
              <select
                id="speciality"
                name="Speciality"
                className="form-select mt-1 block w-full pl-3 pr-10 py-4 text-white focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                defaultValue="Dentist"
              >
                <option>Dentist</option>
              </select>
            </div>
            <div>
              <label htmlFor="location" className="sr-only">
                Location
              </label>
              <select
                id="location"
                name="Location"
                className="form-select mt-2 block w-full pl-3 pr-10 py-4 text-white focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                defaultValue="New York, NY, USA"
              >
                <option>Atlanta, GA, USA</option>
                <option>New York, NY, USA</option>
              </select>
            </div>
            <div>
              <label htmlFor="location" className="sr-only">
                Insurance carrier
              </label>
              <select
                id="insurance-carrier"
                name="Insurance carrier"
                className="form-select mt-2 block w-full pl-3 pr-10 py-4 text-white focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                defaultValue="United Healthcare Dental"
              >
                <option>United Healthcare Dental</option>
              </select>
            </div>
            <button
              type="submit"
              className="form-button group relative w-full flex justify-center mt-2 py-4 px-4 border border-transparent text-md font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Find
              <span className="absolute right-2 inset-y-0 flex items-center pl-3">
                <SearchIcon className="h-5 w-5 text-white group-hover:text-gray" aria-hidden="true" />
              </span>
            </button>
          </div>
        </div>
        <style jsx>{`
          .form {
            background-color: ${Colors.LIGHT_BLUE};
          }
          .form-select {
            background-color: ${Colors.HIGH_LIGHT};
            border: none;
            color: ${Colors.DARK_BLUE};
          }
          .form-button {
            background-color: ${Colors.DARK_BLUE};
          }
        `}</style>
      </div>
    </Layout>
  )
}
