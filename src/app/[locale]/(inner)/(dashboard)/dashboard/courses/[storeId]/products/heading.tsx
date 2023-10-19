"use client";

import { Icon } from "@iconify/react";

const Heading = () => {
  return (
    <div>
      <div className="mb-4 flex space-x-3 text-zinc-600 dark:text-zinc-200">
        <div className="flex items-center space-x-1">
          <Icon icon="ph:pencil-simple-duotone" className="text-xl" />
          <span className="text-sm">Edit Details</span>
        </div>
        <div className="flex items-center space-x-1">
          <Icon icon="ph:eye-duotone" className="text-xl" />
          <span className="text-sm">Preview</span>
        </div>
        <div className="flex items-center space-x-1">
          <Icon icon="ph:option-duotone" className="text-xl" />
          <span className="text-sm">More options</span>
        </div>
      </div>
    </div>
  );
};

export default Heading;
