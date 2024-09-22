import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | Commons Connect',
  description: 'Learn more about Commons Connect, its purpose, and how to get involved.',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">About Commons Connect <span className="text-gray-500 text-lg">Version 1.0</span></h1>

      <p className="mb-4">
        Commons Connect is a technical exercise designed to explore the power of graph databases and graph algorithms in connecting and analyzing political data.
        It allows users to explore MPs, their voting histories, contracts awarded by political parties, and donations made to them.
      </p>

      <p className="mb-4">
        Under the hood, the app leverages a graph database to establish relationships between different data points, enabling the identification of similarities and patterns that might not be readily apparent in traditional relational databases.
        We're particularly excited about the potential of graph algorithms to uncover deeper insights into the political landscape.
      </p>

      <p className="mb-4">
        It's important to emphasize that this project is purely for educational and exploratory purposes.
        We have no plans to monetize it or display any advertisements.
      </p>


      <p className="mb-4">
        Consider this the first step in a larger journey. We see Commons Connect as a foundation upon which we can build more sophisticated features and analyses in the future.
      </p>

      <p className="mb-4">
        We welcome feature requests, bug reports, and any other form of assistance.
        Feel free to reach out to us at <a href="mailto:rob@robincroft.com" className="text-primary hover:underline">rob@robincroft.com</a>.
      </p>

    </div>
  );
}