'use client';
import { useEffect, useState } from "react";

interface Report {
  _id: string;
  wasteType: string;
  location: string;
  createdAt: string; // or Date if it's parsed
}

export default function AdminPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch("/api/report/fetchReports");
        const data = await response.json();
        if (data.reports) {
          setReports(data.reports);
        }
      } catch (error) {
        console.error("❌ Failed to fetch reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <div>
      <h1>Admin Panel - Reports</h1>
      {loading ? (
        <p>Loading reports...</p>
      ) : (
        <div>
          <table>
            <thead>
              <tr>
                <th>Waste Type</th>
                <th>Location</th>
                <th>Reported At</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report._id}>
                  <td>{report.wasteType}</td>
                  <td>{report.location}</td>
                  <td>{new Date(report.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
