function Process() {
  return (
    <div className="flex steps ">
      <div className="flex-1 step step-primary after:!text-white ">
        Define address spaces
      </div>
      <div className="flex-1 step step-primary after:!text-white">
        Calculate subnets
      </div>
      <div className="flex-1 step step-neutral before:!bg-black after:!text-white">
        Store configurations
      </div>
      <div className="flex-1 step step-neutral after:!text-white">
        Deploy to infrastructure
      </div>
    </div>
  );
}

export default Process;
