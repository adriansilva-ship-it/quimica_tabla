/**
 * Química Pro - Motor Principal
 * Arquitectura modular estructurada para alta escalabilidad
 */

// 1. Base de Datos (Muestra de 10, escalable a 118)
const elementosData = [
    { num: 1, sym: 'H', name: 'Hidrógeno', mass: '1.008', group: 1, period: 1, cat: 'No metal', desc: 'Elemento más abundante del universo.' },
    { num: 2, sym: 'He', name: 'Helio', mass: '4.0026', group: 18, period: 1, cat: 'Gas noble', desc: 'Gas inerte utilizado en refrigeración y globos.' },
    { num: 3, sym: 'Li', name: 'Litio', mass: '6.94', group: 1, period: 2, cat: 'Metal alcalino', desc: 'Metal más ligero, usado en baterías modernas.' },
    { num: 4, sym: 'Be', name: 'Berilio', mass: '9.0122', group: 2, period: 2, cat: 'Metal alcalinotérreo', desc: 'Usado en componentes aeroespaciales.' },
    { num: 5, sym: 'B', name: 'Boro', mass: '10.81', group: 13, period: 2, cat: 'Metaloide', desc: 'Esencial para vidrios resistentes al calor.' },
    { num: 6, sym: 'C', name: 'Carbono', mass: '12.011', group: 14, period: 2, cat: 'No metal', desc: 'Pilar de la química orgánica y la vida.' },
    { num: 7, sym: 'N', name: 'Nitrógeno', mass: '14.007', group: 15, period: 2, cat: 'No metal', desc: 'Compone el 78% de la atmósfera terrestre.' },
    { num: 8, sym: 'O', name: 'Oxígeno', mass: '15.999', group: 16, period: 2, cat: 'No metal', desc: 'Vital para la respiración y la combustión.' },
    { num: 9, sym: 'F', name: 'Flúor', mass: '18.998', group: 17, period: 2, cat: 'Halógeno', desc: 'Elemento más electronegativo.' },
    { num: 10, sym: 'Ne', name: 'Neón', mass: '20.180', group: 18, period: 2, cat: 'Gas noble', desc: 'Conocido por su brillo rojo en tubos de descarga.' }
    // Añadir el resto aquí manteniendo esta misma estructura limpia
];

// 2. Clase Principal de la Aplicación
class PeriodicaApp {
    constructor(data) {
        this.data = data;
        this.grid = document.getElementById('grid-elementos');
        this.searchInput = document.getElementById('buscador');
        this.filterSelect = document.getElementById('filtro-categoria');
        this.counter = document.getElementById('conteo-elementos');
        
        // Modal elements
        this.modal = document.getElementById('modal-detalle');
        this.modalContent = document.getElementById('modal-contenido');
        this.closeBtn = document.querySelector('.btn-close');

        this.init();
    }

    init() {
        this.renderTable(this.data);
        this.setupEventListeners();
        this.populateComparators();
    }

    // Normaliza strings para crear clases CSS válidas
    getCatClass(cat) {
        return 'cat-' + cat.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '');
    }

    renderTable(elementos) {
        this.grid.innerHTML = '';
        this.counter.textContent = `Mostrando: ${elementos.length} elementos`;

        elementos.forEach(el => {
            const card = document.createElement('div');
            card.className = `element-box ${this.getCatClass(el.cat)}`;
            
            // Asignación en CSS Grid
            card.style.gridColumn = el.group;
            card.style.gridRow = el.period;
            
            // Color de fondo dinámico basado en CSS Vars
            card.style.backgroundColor = `var(--${this.getCatClass(el.cat)}, rgba(255,255,255,0.1))`;

            card.innerHTML = `
                <div class="e-num">${el.num}</div>
                <div class="e-sym">${el.sym}</div>
                <div class="e-name">${el.name}</div>
                <div class="e-mass">${el.mass}</div>
            `;

            card.addEventListener('click', () => this.openModal(el));
            this.grid.appendChild(card);
        });
    }

    setupEventListeners() {
        // Búsqueda en tiempo real
        this.searchInput.addEventListener('input', () => this.filterData());
        this.filterSelect.addEventListener('change', () => this.filterData());

        // Eventos del Modal
        this.closeBtn.addEventListener('click', () => this.closeModal());
        window.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeModal();
        });
    }

    filterData() {
        const term = this.searchInput.value.toLowerCase();
        const cat = this.filterSelect.value;

        const filtered = this.data.filter(el => {
            const matchText = el.name.toLowerCase().includes(term) || 
                              el.sym.toLowerCase().includes(term) || 
                              el.num.toString().includes(term);
            const matchCat = cat === 'todos' || el.cat === cat;
            return matchText && matchCat;
        });

        this.renderTable(filtered);
    }

    openModal(el) {
        this.modalContent.innerHTML = `
            <div class="modal-header-info">
                <div class="modal-big-sym">${el.sym}</div>
                <div>
                    <h2 style="font-size: 2.5rem; margin-bottom: 0.5rem;">${el.name}</h2>
                    <span class="badge" style="background: var(--${this.getCatClass(el.cat)}); border:none; color: white;">${el.cat}</span>
                </div>
            </div>
            <div class="modal-grid-data">
                <div class="data-item"><span>Número Atómico (Z)</span><strong>${el.num}</strong></div>
                <div class="data-item"><span>Masa Atómica</span><strong>${el.mass} u</strong></div>
                <div class="data-item"><span>Posición</span><strong>Grupo ${el.group}, Período ${el.period}</strong></div>
            </div>
            <div style="margin-top: 1.5rem; padding: 1.5rem; background: rgba(0,0,0,0.2); border-radius: 12px; border: 1px solid var(--glass-border);">
                <span style="display:block; color: var(--accent-blue); margin-bottom:0.5rem; font-weight:bold;">Nota Científica:</span>
                <p style="color: var(--text-muted);">${el.desc}</p>
            </div>
        `;
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Evitar scroll de fondo
    }

    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    populateComparators() {
        const c1 = document.getElementById('comp-left');
        const c2 = document.getElementById('comp-right');
        
        this.data.forEach(el => {
            const opt = new Option(`${el.sym} - ${el.name}`, el.num);
            c1.add(opt.cloneNode(true));
            c2.add(opt);
        });
    }
}

// 3. Sistema de Partículas para Fondo (Efecto Visual Avanzado)
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('bg-particles');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.init();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        const particleCount = (window.innerWidth * window.innerHeight) / 15000;
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 2 + 1,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5
            });
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fill();
        });
        this.drawConnections();
    }

    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(14, 165, 233, ${0.15 - distance/800})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new PeriodicaApp(elementosData);
    new ParticleSystem(); // Inicia el fondo animado
});