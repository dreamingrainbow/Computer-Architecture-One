/**
 * LS-8 v2.0 emulator skeleton code
 */

const fs = require('fs');

// Instructions

// !!! IMPLEMENT ME

const ADD = 0b10101000; // Add R1 R2

const AND = 0b10110011;
const CALL = 0b01001000;
const CMP = 0b10100000;
const DEC = 0b01111001;
const DIV = 0b10101011;
const HLT = 0b00000001; // Halt CPU
const INC = 0b01111000;
const INT = 0b01001010;
const IRET = 0b00001011;
const JEQ = 0b01010001;
const JGT = 0b01010100;
const JLT = 0b01010011;
const JMP = 0b01010000;
const JNE = 0b01010010;
const LD = 0b10011000;
const LDI = 0b10011001;
const MOD = 0b10101100;
const MUL = 0b10101010;
const NOP = 0b00000000;
const NOT = 0b01110000;
const OR = 0b10110001;
const POP = 0b01001100;
const PRA = 0b01000010;
const PRN  = 0b01000011;
const PUSH = 0b01001101;
const RET = 0b00001001;
const ST = 0b10011010;
const SUB = 0b10101001;
const XOR = 0b10110010;

const SP = 7;

const FL_EQ = 0b00000001;
const FL_GT = 0b00000010;
const FL_LT = 0b00000100;


/**
 * Class for simulating a simple Computer (CPU & memory)
 */
class CPU {

    /**
     * Initialize the CPU
     */
    constructor(ram) {
        this.ram = ram;
        this.reg = new Array(8).fill(0); // General-purpose registers        
        // Special-purpose registers
        this.reg.PC = 0; // Program Counter
        this.reg.IR = 0; // Instruction Register
        this.reg[SP] = 0xf3;
		this.setupBranchTable();
    }
	
	/**
	 * Sets up the branch table
	 */
	setupBranchTable() {
		let bt = {};

        bt[ADD] = this.ADD;
        bt[AND] = this.AND;
        bt[CALL] = this.CALL;
        bt[CMP] = this.CMP;
        bt[DEC] = this.DEC;
        bt[DIV] = this.DIV;                
        bt[HLT] = this.HLT;
        bt[INC] = this.INC;
        bt[INT] = this.INT;
        bt[IRET] = this.IRET;
        bt[JEQ] = this.JEQ;
        bt[JGT] = this.JGT;
        bt[JLT] = this.JLT;
        bt[JMP] = this.JMP;
        bt[JNE] = this.JNE;
        bt[LD] = this.LD;
        // LDI
        bt[LDI] = this.LDI;
        bt[MOD] = this.MOD;
        // MUL       
        bt[MUL] = this.MUL;
        bt[NOP] = this.NOP;
        bt[NOT] = this.NOT;
        bt[OR] = this.OR;
        bt[POP] = this.POP;
        bt[PRA] = this.PRA;        
        // PRN
        bt[PRN] = this.PRN;
        bt[PUSH] = this.PUSH;
        bt[RET] = this.RET;
        bt[ST] = this.ST;                
        bt[SUB] = this.SUB;
        bt[XOR] = this.XOR;        
		this.branchTable = bt;
	}

    /**
     * Store value in memory address, useful for program loading
     */
    poke(address, value) {
        this.ram.write(address, value);
    }

    /**
     * Starts the clock ticking on the CPU
     */
    startClock() {
        console.log('Starting clock begin tick.');
        const _this = this;
        this.clock = setInterval(() => {
            _this.tick();
        }, 1);
    }

    /**
     * Stops the clock
     */
    stopClock() {
        console.log('Clock stopped');
        clearInterval(this.clock);
    }

    /**
     * 
     */
    setFlag(flag, value) {
        let numValue = value ? 1 : 0;

        if(value === true) {
            this.reg.Fl = this.reg.FL | flag;
        } else {
            this.reg.FL = this.reg.FL & (~flag & 255);
        }
    }

    /**
     * ALU functionality
     * 
     * op can be: ADD SUB MUL DIV INC DEC CMP
     */
    alu(op, regA, regB) {
        switch (op) {
            case 'ADD':
                console.log('Add two numbers.', this.reg[regA] , this.reg[regB]);
                this.reg[regA] = this.reg[regA] + this.reg[regB];
            break;
            case 'AND':
                console.log();
                this.reg[regA] = this.reg[regA] & this.reg[regB];
            break;
            case 'CALL':
            
            break;
            case 'SUB':
                console.log('Subtracting');
                this.reg[regA] = this.reg[regA] - this.reg[regB];
            break;
            case 'MUL':
                console.log('Multiply');
                console.log(this.reg[regA] * this.reg[regB])
                this.reg[regA] = this.reg[regA] * this.reg[regB];
            break;
            case 'DIV':
                console.log('Divide the numbers.');
                this.reg[regA] = this.reg[regA] / this.reg[regB];
            break;
            case 'INC':
                console.log('Increment the number.');
                this.reg[regA]++;
            break;
            case 'DEC':
                console.log('Decrement the number.');
                this.reg[regA]--;
            break;
            case 'CMP':
                // !!! IMPLEMENT ME
                this.reg[regA] = this.reg[regA] === this.reg[regB];                
            break;

            case 'NOP':
            break;
        }
    }

    /**
     * Advances the CPU one cycle
     */
    tick() {
        console.log('Ticked.');
        // Load the instruction register (OR) from the current PC
        // !!! IMPLEMENT ME
        this.reg.IR = this.ram.read(this.reg.PC);
        // Debugging output
        console.log(`${this.reg.PC}: ${this.reg.IR.toString(2)}`);
        console.log(this.reg.IR);
        // Based on the value in the Instruction Register, locate the
        // appropriate hander in the branchTable
        // !!! IMPLEMENT ME
        let handler = this.branchTable[this.reg.IR];
        console.log('Using handler', handler);
        // Check that the handler is defined, halt if not (invalid
        // instruction)
        // !!! IMPLEMENT ME
        if(handler === undefined){
            console.log('unknown opcode.');
            this.stopClock();
        }

        let operandA = this.ram.read(this.reg.PC+1);
        let operandB = this.ram.read(this.reg.PC+2);
        console.log(operandA, operandB);
        // We need to use call() so we can set the "this" value inside
        // the handler (otherwise it will be undefined in the handler)
        let nextPC = handler.call(this, operandA, operandB);
        // Increment the PC register to go to the next instruction
        // !!! IMPLEMENT ME
        console.log('pc',this.reg.PC);
        console.log((this.reg.IR >> 6) & 0b00000011 + 1)
        if(nextPC === undefined) {
            this.reg.PC += ((this.reg.IR >> 6) & 0b00000011) + 1;

        } else {
            this.reg.PC = nextPC;
        }
        console.log('pc', this.reg.PC);
    }

    // INSTRUCTION HANDLER CODE:

    /**
     * HLT
     */
    HLT() {
        // !!! IMPLEMENT ME
        this.stopClock();
    }

    /**
     * ADD
     */
    ADD(registerA, registerB) {
        // !!! IMPLEMENT ME
        this.alu('ADD', registerA, registerB);
    }

    /**
     * AND
     */
    AND(registerA, registerB) {
        // !!! IMPLEMENT ME
        this.alu('AND', registerA, registerB);
    }

    /**
     * DIV
     */
    DIV(registerA, registerB) {
        // !!! IMPLEMENT ME
        this.alu('DIV', registerA, registerB);
    }

    /**
     * SUB
     */
    SUB(registerA, registerB) {
        // !!! IMPLEMENT ME
        this.alu('SUB', registerA, registerB);
    }

    /**
     * LDI R,I
     */
    LDI(R,I) {
        // !!! IMPLEMENT ME
        this.reg[R] = I;
    }

    /**
     * MUL R,R
     */
    MUL(regA, regB) {
        // !!! IMPLEMENT ME
        return this.alu('MUL', regA, regB);
    }

    /**
     * PRN R
     */
    PRN(R) {
        console.log('The answer is:');
        console.log(this.reg[R]);
    }
    
    /**
     * INC
     */
    INC(registerA, registerB) {
        // !!! IMPLEMENT ME
        this.alu('INC', registerA, registerB);
    }

    /**
     * NOP
     */
    NOP() {
        return;
    }

    pushHelper(value) {
        this.reg[SP]--;
        this.ram.write(this.reg[SP], value);
    }

    popHelper() {
        let val = this.ram.read(this.reg[SP]);
        this.reg[SP]++;
        return val;
    }
    /**
     * PUSH
     */
    PUSH(regNum) {
        let value = this.reg[regNum];
        pushHelper(value);
    }
    
    /**
     * POP
     */
    POP(regNum) {
        let val = popHelper();
        this.reg[regNum] = val;
    }
        
    /**
     * CALL
     */
    CALL(regNum) {
        pushHelper(this.reg.PC + 2);
        return this.reg[regNum];
    }
    


}

module.exports = CPU;
