function IpInput() {
  return (
    <>
      <div className="flex w-full items-center justify-center font-montserrat">
        <div className="pt-14">
          <div className="flex">
            <input
              type="text"
              placeholder="IP-Address"
              className="text-sm sm:text-base relative border-t-2 border-l-2 border-b-2 border-r rounded-l-lg placeholder-gray-400 focus:border-orange-600 focus:outline-none py-2 pr-8 pl-8 border-zinc-950"
            ></input>
            <select
              id="countries"
              className=" border-t-2 border-r-2 border-b-2 border-l border-zinc-950 text-sm rounded-r-lg focus:border-orange-600 p-2.5 "
            >
              <option value="US">/21</option>
              <option value="CA">/22</option>
              <option value="FR">/23</option>
              <option value="DE">/24</option>
              <option value="DE">/25</option>
              <option value="DE">/26</option>
              <option value="DE">/27</option>
            </select>
            <div className=" flex pl-2 items-center justify-center">
              <button className="inline-flex items-center justify-center w-6 h-6 mr-2 text-slate-50 transition-colors duration-150 bg-blue-700 rounded-lg focus:shadow-outline hover:bg-orange-600">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                  <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"></path>
                </svg>
              </button>
            </div>
          </div>
          <div className="flex pt-4 justify-center items-center">
            <div className="">Possible IP-Addresses:</div>
            <div className="pl-2 text-blue-700 font-bold text-xl">256</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default IpInput;
