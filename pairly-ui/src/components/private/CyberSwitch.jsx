import React from 'react';

const CyberSwitch = ({ checked, onChange, id, size = 40 }) => {
  // size = width of toggle, default 40px (fits compact layout)
  return (
    <>
      <div
        className="cyber-toggle"
        style={{ '--core-size': `${size}px`, background: 'transparent', padding: 0 }}
      >
        <input
          id={id}
          type="checkbox"
          className="cyber-input"
          checked={checked}
          onChange={onChange}
        />
        <label htmlFor={id} className="cyber-label">
          <div className="cyber-core">
            <div className="cyber-toggle-circle"></div>
          </div>

          <div className="cyber-power-line"></div>

          <div className="cyber-power-ring">
            {[0.1, 0.3, 0.5, 0.7].map((delay, i) => (
              <div
                key={i}
                style={{
                  '--x': `${10 + i * 30}%`,
                  '--y': `${20 + i * 20}%`,
                  '--px': `${15 * (i % 2 === 0 ? 1 : -1)}px`,
                  '--py': `${-10 + i * 5}px`,
                  '--delay': `${delay}s`
                }}
                className="ring-particle"
              ></div>
            ))}
          </div>

          <div className="cyber-particles">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="particle"></div>
            ))}
          </div>
        </label>
      </div>

      <style>{`
        .cyber-toggle {
          --hue: 180;
          display: inline-block;
          border-radius: 35px;
          position: relative;
          overflow: hidden;
          transition: transform 0.2s ease-in-out;
        }
        .cyber-toggle:hover {
          transform: perspective(100px) rotateX(3deg) rotateY(-3deg);
        }
        .cyber-input { position: absolute; opacity: 0; }
        .cyber-label {
          display: block;
          cursor: pointer;
          width: var(--core-size);
          height: calc(var(--core-size)/2);
          position: relative;
          transition: filter 0.2s ease;
        }
        .cyber-core {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 40px;
          transition: all 0.3s ease;
          box-shadow: inset 0 2px 8px rgba(255,255,255,0.1),
                      inset 0 -2px 6px rgba(0,0,0,0.4);
        }
        .cyber-toggle-circle {
          position: absolute;
          width: calc(var(--core-size)/2 - 4px);
          height: calc(var(--core-size)/2 - 4px);
          background: #ffffff;
          border-radius: 50%;
          top: 2px;
          left: 2px;
          transition: transform 0.3s ease;
          box-shadow: 0 1px 4px rgba(0,0,0,0.3),
                      inset 0 1px 1px rgba(255,255,255,0.8);
        }
        .cyber-input:checked ~ .cyber-label .cyber-toggle-circle {
          transform: translateX(calc(var(--core-size)/2));
        }
        .cyber-label:hover .cyber-core {
          transform: scale(1.05);
          filter: brightness(1.2);
          box-shadow: inset 0 4px 12px rgba(255,255,255,0.2),
                      inset 0 -4px 8px rgba(0,0,0,0.3);
        }
        .cyber-input:active ~ .cyber-label .cyber-core { transform: scale(0.95); }

        /* Power Line */
        .cyber-power-line {
          position: absolute;
          width: calc(var(--core-size)*1.14159 + 4rem);
          height: 2px;
          background: linear-gradient(135deg, hsl(280,80%,40%), hsl(320,70%,50%), hsl(340,85%,45%));
          top: 50%;
          left: calc(-1*(var(--core-size)+2rem));
          transform: translateY(-220%);
          opacity: 0;
          pointer-events: none;
        }
        .cyber-input:checked + .cyber-label .cyber-power-line {
          animation: power-line-in 0.6s ease forwards;
        }
        @keyframes power-line-in {
          0% { opacity:1; transform: translateY(-50%) translateX(-100%); }
          50% { opacity:1; transform: translateY(-50%) translateX(0); }
          100% { opacity:0; transform: translateY(-50%) translateX(100%); }
        }

        /* Power Ring */
        .cyber-power-ring {
          position: absolute;
          inset: -2px;
          outline: 3px solid transparent;
          border-radius: 12px;
          opacity: 0;
          transform: scale(1);
          pointer-events: none;
          box-shadow: 0 0 6px transparent;
          background: linear-gradient(to right, rgba(99,49,49,0.2), rgba(31,28,212,0.2), rgba(64,6,112,0.2), rgba(131,33,161,0.2), rgba(132,14,179,0.2), rgba(255,0,242,0.2));
          background-size: 200% 100%;
        }
        .cyber-input:checked + .cyber-label .cyber-power-ring {
          animation: power-ring-appear 0.6s ease 0.3s forwards,
                     ring-glow 2.5s linear infinite 0.9s;
        }
        .cyber-input:checked + .cyber-label .cyber-power-ring .ring-particle {
          animation: ring-particle-fly 1s ease-out infinite var(--delay);
        }
        .cyber-input:not(:checked) + .cyber-label .cyber-power-ring {
          animation: power-ring-break 0.8s ease forwards;
        }
        .cyber-power-ring .ring-particle {
          position: absolute;
          width: 4px; height: 4px; background: #fff; border-radius: 50%;
          opacity: 0;
          left: var(--x); top: var(--y);
        }
        @keyframes power-ring-appear {
          0% {opacity:0; transform:scale(0.8);}
          50% {opacity:1; transform:scale(1.1);}
          100% {opacity:1; transform:scale(1);}
        }
        @keyframes ring-glow {
          0% { background-position:0% 0; box-shadow:0 0 6px rgba(255,255,255,0.8);}
          50% { background-position:100% 0; box-shadow:0 0 6px rgba(0,0,0,0.8);}
          100% { background-position:200% 0; box-shadow:0 0 6px rgba(255,255,255,0.8);}
        }
        @keyframes power-ring-break {
          0% { opacity:1; clip-path: inset(0 0 0 0);}
          25% { clip-path: inset(0 25% 0 25%);}
          50% { clip-path: inset(25% 25% 25% 25%);}
          75% { clip-path: inset(40% 40% 40% 40%);}
          100% { opacity:0; clip-path: inset(50% 50% 50% 50%);}
        }
        @keyframes ring-particle-fly {
          0% { opacity:1; transform:translate(0,0);}
          100% { opacity:0; transform:translate(var(--px), var(--py));}
        }

        /* Small particles */
        .cyber-particles { position:absolute; inset:0; }
        .particle {
          position:absolute;
          width:3px; height:3px;
          background: hsl(var(--hue),100%,70%);
          border-radius:50%;
          opacity:0;
          left:50%; top:50%;
          transform:translate(-50%,-50%);
        }
        .cyber-input:checked ~ .cyber-label .particle {
          animation: particle-fly 0.8s ease-out forwards;
        }
        @keyframes particle-fly {
          0% { opacity:1; transform:translate(-50%,-50%);}
          100% { opacity:0; transform:translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))); }
        }
        .particle:nth-child(1){--dx:20px; --dy:-20px;}
        .particle:nth-child(2){--dx:-15px; --dy:25px;}
        .particle:nth-child(3){--dx:25px; --dy:15px;}
        .particle:nth-child(4){--dx:-20px; --dy:-15px;}
        .particle:nth-child(5){--dx:0px; --dy:-30px;}
      `}</style>
    </>
  );
};

export default CyberSwitch;
