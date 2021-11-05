import { SearchIcon, LoginIcon } from '@heroicons/react/solid'
import Layout from '../components/layout';
import Colors from '../constants/colors';

export default function MyAccount() {
  return (
    <Layout>
      <div className="px-4 pt-1 sm:px-0 min-h-screen">
        <div className="bg-local bg-top bg-cover rounded-lg mb-1 h-96" style={{ backgroundImage: "url('../images/background-2.jpg')" }}></div>
        <div className="form rounded-lg py-6 h-auto">
          <div className="pt-1">
            <div className="text text-center text-md text-grey font-medium">
             My Account
            </div>
          </div>
        </div>
        <style jsx>{`
          .text {
            color: ${Colors.DARK_GRAY}; 
          }
        `}</style>
      </div>
    </Layout>
  )
}
