function TableHead() {
  return (
    <>
      <div className="flex justify-center content-center w-full">
        <div className="flex font-montserrat pt-6 w-full max-w-screen-md">
          <div className="flex pl-4 flex-initial w-5/12 min-w-52 text-zinc-500 font-bold">
            Name
          </div>
          <div className="flex pl-6 flex-initial w-28 w-min-28 text-zinc-500 font-bold">
            Size
          </div>
          <div className="flex pl-6 flex-initial w-28 w-min-28 text-zinc-500 font-bold">
            IPs
          </div>
          <div className="flex pl-6 flex-initial w-80 w-min-80 text-zinc-500 font-bold">
            Range
          </div>
        </div>
      </div>
    </>
  );
}

export default TableHead;
