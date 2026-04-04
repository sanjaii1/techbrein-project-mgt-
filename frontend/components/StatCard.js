export default function StatCard({ title, value, icon, gradient }) {
  return (
    <div className="glass overflow-hidden rounded-2xl relative shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 group">
       <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-20 blur-2xl rounded-bl-[100px] transition-opacity group-hover:opacity-40`}></div>
       <div className="p-6 relative z-10 flex flex-col h-full">
         <div className="flex justify-between items-start mb-4">
           <span className="text-slate-600 font-semibold tracking-wide text-sm uppercase">{title}</span>
           <span className="text-2xl drop-shadow-md">{icon}</span>
         </div>
         <div className="mt-auto">
           <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight">{value}</h3>
         </div>
       </div>
    </div>
  );
}
