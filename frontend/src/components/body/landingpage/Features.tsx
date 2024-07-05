import { Link, useLocation } from "react-router-dom";

function Features() {
  const location = useLocation();
  return (
    <section className="py-8">
      <div className="">
        <div className=" pb-10 mb-4 lg:mb-4 flex justify-center items-center flex-col gap-x-0 gap-y-6 lg:gap-y-0 lg:flex-row lg:justify-between max-md:max-w-lg max-md:mx-auto">
          <div className="relative w-full text-center lg:text-left lg:w-2/4">
            <h2 className="text-4xl font-semibold text-gray-900 leading-[3.25rem] lg:mb-6 mx-auto max-w-max lg:max-w-md lg:mx-0">
              Experience the power of streamlined{" "}
              <span className="text-sky-800">IP </span> and
              <span className="text-sky-800">
                {" "}
                subnet solutions{" "}
              </span> today{" "}
            </h2>
          </div>
          <div className="relative text-center lg:text-left lg:w-2/4 ">
            <p className="text-lg font-normal text-gray-500 mb-5 w-full">
              Unlock exclusive features and seamless virtual network management
              - sign in now to transform your cloud experience!
            </p>
            <div className="flex bg-sky-800 text-white rounded-lg p-2 w-fit hover:bg-secondary hover:scale-110 transition">
              <Link
                to="/register"
                state={{ registerpopouplocation: location }}
                className="flex items-center h-full font-semibold "
              >
                Sign Up
                <svg
                  className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 5h12m0 0L9 1m4 4L9 9"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center gap-x-5 gap-y-6 lg:gap-y-0 flex-wrap md:flex-wrap lg:flex-nowrap lg:flex-row lg:justify-between lg:gap-x-8 pb-10">
          <div className="group relative w-full bg-gray-200 rounded-2xl p-4 transition-all duration-150 max-md:max-w-md max-md:mx-auto md:w-2/5 md:h-64 xl:p-7 xl:w-1/3 hover:bg-secondary hover:scale-110">
            <div className="bg-white rounded-full flex justify-center items-center mb-5 w-14 h-14">
              <svg
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 5V25M5 15H25"
                  stroke="#0a0a0a"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <h4 className="text-xl font-semibold text-sky-800 mb-3 capitalize transition-all duration-150 group-hover:text-white">
              Multiple address spaces
            </h4>
            <p className="text-sm font-normal text-gray-500 transition-all duration-150 leading-5 group-hover:text-white">
              Calculate your virtuel network with indipendent address spaces to
              increase efficient IP management.
            </p>
          </div>
          <div className="group relative w-full bg-gray-200 rounded-2xl p-4 transition-all duration-150 max-md:max-w-md max-md:mx-auto md:w-2/5 md:h-64 xl:p-7 xl:w-1/3 hover:bg-secondary hover:scale-110">
            <div className="bg-white rounded-full flex justify-center items-center mb-5 w-14 h-14">
              <svg
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.0067 10V15.6652C15.0067 16.0358 15.1712 16.3873 15.4556 16.6248L18.75 19.375M15 27.5C8.09644 27.5 2.5 21.9036 2.5 15C2.5 8.09644 8.09644 2.5 15 2.5C21.9036 2.5 27.5 8.09644 27.5 15C27.5 21.9036 21.9036 27.5 15 27.5Z"
                  stroke="#0a0a0a"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </svg>
            </div>
            <h4 className="text-xl font-semibold text-sky-800 mb-3 capitalize transition-all duration-150 group-hover:text-white">
              Persist configurations
            </h4>
            <p className="text-sm font-normal text-gray-500 transition-all duration-150 leading-5 group-hover:text-white">
              You can store all your network configurations in one place and can
              be accessed anytime and anywhere.
            </p>
          </div>
          <div className="group relative w-full bg-gray-200 rounded-2xl p-4 transition-all duration-150 max-md:max-w-md max-md:mx-auto md:w-2/5 md:h-64 xl:p-7 xl:w-1/3 hover:bg-secondary hover:scale-110">
            <div className="bg-white rounded-full flex justify-center items-center mb-5 w-14 h-14">
              <svg
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 2.5V17.5M15 17.5L10 12.5M15 17.5L20 12.5"
                  stroke="#0a0a0a"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M25 15V20C25 21.6569 23.6569 23 22 23H8C6.34315 23 5 21.6569 5 20V15"
                  stroke="#0a0a0a"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <h4 className="text-xl font-semibold text-sky-800 mb-3 capitalize transition-all duration-150 group-hover:text-white">
              Deploy your network
            </h4>
            <p className="text-sm font-normal text-gray-500 transition-all duration-150 leading-5 group-hover:text-white">
              You can export your Virtuel Network configurations for Terraform,
              Bicep or ARM deployments.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;
