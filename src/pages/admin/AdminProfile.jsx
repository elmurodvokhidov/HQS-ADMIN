import { useSelector } from "react-redux"

const AdminProfile = () => {
    const { auth, isLoading } = useSelector(state => state.auth);

    return (
        <div className="container">
            {
                isLoading ? <h1>Loading...</h1> :
                    <div className="max-w-2xl shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Adminstrator
                            </h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                Foydalanuvchi haqida ma'lumot va tafsilotlar
                            </p>
                        </div>
                        <div className="border-t border-gray-200">
                            <dl>
                                <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Ismi (FIO)
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {auth?.fullname}
                                    </dd>
                                </div>
                                <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Telefon
                                    </dt>
                                    <dd className="mt-1 text-sm text-blue-500 sm:mt-0 sm:col-span-2">
                                        +998{auth?.phoneNumber}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
            }
        </div>
    )
}

export default AdminProfile