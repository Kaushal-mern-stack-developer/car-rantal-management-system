const reasons = [
  { title: "Clear prices", text: "You see the price per day before you book. No hidden charges." },
  { title: "Well kept cars", text: "Every car is cleaned and checked before each rental." },
  { title: "Easy booking", text: "Pick a car, choose your dates and confirm in one short form." },
];

function AboutSection() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="mb-3 text-center text-3xl font-bold">About DriveEasy</h2>
      <p className="mx-auto mb-10 max-w-2xl text-center text-gray-600 dark:text-gray-300">
        DriveEasy is a car rental company that makes it simple to get on the road. Whether it is a
        weekend trip or a business visit, we have a car for you.
      </p>
      <div className="grid gap-6 md:grid-cols-3">
        {reasons.map((item) => (
          <div key={item.title} className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <h3 className="mb-2 text-lg font-semibold text-primary">{item.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default AboutSection;
