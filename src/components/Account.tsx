import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from "wagmi";

const Account = () => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! });

  return (
    <div className="text-gray-500 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800">
      {ensAvatar && (
        <img
          alt="ENS Avatar"
          src={ensAvatar}
          className="w-12 h-12 rounded-full"
        />
      )}
      <div>
        {address && (
          <div className="text-sm text-gray-500">
            {ensName
              ? `${ensName} (${address.substring(0, 6)}...${address.substring(
                  address.length - 4
                )})`
              : `${address.substring(0, 6)}...${address.substring(
                  address.length - 4
                )}`}
          </div>
        )}
        <button
          onClick={() => disconnect()}
          className="mt-2 px-4 py-2 bg-rose-900 text-white rounded hover:bg-rose-600 text-xs"
        >
          Disconnect
        </button>
      </div>
    </div>
  );
};

export default Account;
