import React from "react";
import { motion } from "motion/react";

export function Step({ number, title, description, icon: Icon, isLast }) {
  return (
    <div className="relative flex flex-col items-center text-center group">
      {!isLast && (
        <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-[2px] bg-slate-100">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="w-full h-full bg-blue-200 origin-left"
          />
        </div>
      )}
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        className="w-24 h-24 bg-white border-2 border-blue-100 rounded-[2rem] flex items-center justify-center shadow-lg mb-8 relative z-10"
      >
        <Icon className="text-blue-600" size={32} />
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
          {number}
        </div>
      </motion.div>
      <h3 className="text-xl font-bold text-slate-900 mb-3 uppercase tracking-tight">
        {title}
      </h3>
      <p className="text-slate-500 max-w-[200px]">{description}</p>
    </div>
  );
}



