export default function AboutTestnet() {
  return (
    <section className="mt-12 border border-border p-4 rounded-md">
      <h2 className="mb-4 text-2xl font-bold md:text-3xl">About Testnet</h2>
      <p className="mb-2">
        This version of the <span className="font-bold">Dotheon Dashboard</span>{" "}
        is connected to the <span className="font-bold">Testnet</span>. It is a
        testing environment where users can explore the dashboard features and
        simulate staking activities without using real assets.
      </p>
      <p className="mb-2">
        All displayed data, staking flows, and vToken transactions are based on
        testnet networks and are for demonstration purposes only.
      </p>
      <p>
        Please note that assets and transactions on the testnet hold no real
        value.
      </p>
    </section>
  );
}
