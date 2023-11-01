import { ErrorCard } from "~/islands/modules/cards/error-card";
import { Shell } from "~/islands/wrappers/shell-variants";

export default function UnitNotFound(props: any) {
  return (
    <Shell variant="centered" className="max-w-md">
      <ErrorCard
        title="Product not found"
        description="The product may have expired or you may have already updated your product"
        retryLink={`/dashboard/courses`}
        retryLinkText="Go to Products"
      />
    </Shell>
  );
}
