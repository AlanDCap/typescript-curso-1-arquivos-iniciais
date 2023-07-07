import { domInjector } from "../decorators/dom-injector.js";
import { inspect } from "../decorators/inspector.js";
import { logarTempoDeExecucao } from "../decorators/logar-tempo-de-execucao.js";
import { DiasDaSemana } from "../enums/dias-da-semana.js";
import { Negociacao } from "../models/Negociacao.js";
import { Negociacoes } from "../models/negociacoes.js";
import { NegociacoesService } from "../services/negociacoes-service.js";
import { MensagemView } from "../views/mensagem-view.js";
import { NegociacoesView } from "../views/negociacoes-view.js";

export class NegociacaoController{
    @domInjector('#data')
    private inputData: HTMLInputElement;
    @domInjector('#quantidade')
    private inputQuantidade: HTMLInputElement;
    @domInjector('#valor')
    private inputValor: HTMLInputElement;
    private negociacoes = new Negociacoes();
    private negociacoesView = new NegociacoesView('#negociacoesView');
    private mensagemView = new MensagemView('#mensagemView');
    private negociacoesService = new NegociacoesService();

    constructor() {
        //this.inputData = document.querySelector('#data') as HTMLInputElement;
        //this.inputQuantidade = document.querySelector('#quantidade') as HTMLInputElement;
        //this.inputValor = document.querySelector('#valor') as HTMLInputElement;
        this.negociacoesView.update(this.negociacoes);
    }
    @inspect()
    @logarTempoDeExecucao()
    public adiciona(): void {
        const negociacao = Negociacao.criaDe(
            this.inputData.value,
            this.inputQuantidade.value,
            this.inputValor.value
        );

        if (!this.eDiaUtil(negociacao.data)) {
            return this.mensagemView.update('Apenas negociações em dias úteis são aceitas');
        }
        
        this.negociacoes.adiciona(negociacao);
        this.limparFormulario();
        this.atualizaView();
    }

    private eDiaUtil(data: Date) {
        return data.getDay() > DiasDaSemana.DOMINGO && data.getDay() < DiasDaSemana.SABADO;
    }
    importarDados(): void {
        this.negociacoesService.obterNegociacoesDoDia()
            .then(negociacoesDeHoje => {
                for (let negociacao of negociacoesDeHoje) {
                    this.negociacoes.adiciona(negociacao);
                }
                this.negociacoesView.update(this.negociacoes);
            });
    }

    private limparFormulario(): void {
        this.inputData.value = '';
        this.inputQuantidade.value = '';
        this.inputValor.value = '';
        this.inputData.focus();
    }

    private atualizaView(): void {
        this.negociacoesView.update(this.negociacoes);
        this.mensagemView.update('Negociação adicionada com sucesso');
    }
}