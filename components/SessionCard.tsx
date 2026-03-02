import CountdownTimer from "./CountdownTimer";

interface SessionCardProps {
  sessionOpenTime: string; // "HH:MM"
  examStartTime: string; // "HH:MM"
  examEndTime: string; // "HH:MM"
}

function to12Hour(time: string): string {
  if (!time) return "";
  const [hh, mm] = time.split(":").map(Number);
  const period = hh >= 12 ? "PM" : "AM";
  const h = hh % 12 || 12;
  return `${h}:${String(mm).padStart(2, "0")} ${period}`;
}

export default function SessionCard({
  sessionOpenTime,
  examStartTime,
  examEndTime,
}: SessionCardProps) {
  return (
    <div className="flex justify-center px-4 pb-8">
      <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl shadow-lg p-6 w-full max-w-lg text-center">
        {/* Session label */}
        <div className="inline-block bg-blue-700 text-white text-sm font-bold px-4 py-1 rounded-full mb-4">
          SESSION 1
        </div>

        <p className="text-lg font-semibold text-gray-800 mb-1">
          Opens at{" "}
          <span className="text-blue-700 font-bold">
            {to12Hour(sessionOpenTime)}
          </span>
        </p>

        {/* Countdown */}
        <div className="my-3">
          <p className="text-sm text-gray-500 mb-1">Opens in:</p>
          <CountdownTimer targetTime={sessionOpenTime} />
        </div>

        {/* Divider */}
        <div className="border-t border-yellow-300 my-3" />

        {/* Exam time */}
        <p className="text-sm text-gray-700">
          <span className="font-semibold text-gray-900">Exam Time:</span>{" "}
          <span className="text-blue-800 font-bold">
            {to12Hour(examStartTime)} – {to12Hour(examEndTime)}
          </span>
        </p>
      </div>
    </div>
  );
}
