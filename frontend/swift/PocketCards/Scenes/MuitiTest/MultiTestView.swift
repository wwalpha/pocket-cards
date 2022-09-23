//
//  MultiTestView.swift
//  PocketCards
//
//  Created by macmini on 2022/09/17.
//
//

import SwiftUI

struct MultiTestView: View {
    var interactor: MultiTestBusinessLogic?

    @ObservedObject var viewModel = MultiTestViewModel()

    var body: some View {
        VStack {
            if viewModel.isShowQuestion {
                if viewModel.question?.choices != nil {
                    ChoiceQuestion(
                        question: viewModel.question!,
                        isShowError: "",
                        onChoice: interactor!.onChoice
                    )
                } else if viewModel.question != nil {
                    // Society or Science
                    FlashCard(flipped: false, readOnly: true, question: viewModel.question!, action: interactor!.onAction)
                }
            } else if viewModel.isShowAnswer {
                let _ = debugPrint("show answer")
                if viewModel.question?.choices != nil {
                    ChoiceQuestion(
                        question: viewModel.question!,
                        isShowError: viewModel.question!.answer,
                        onChoice: interactor!.onChoice
                    )
                } else if viewModel.question != nil {
                    // Society or Science
                    FlashCard(flipped: true, readOnly: true, question: viewModel.question!, action: interactor!.onAction)
                }

            } else if viewModel.isConnecting {
                Text("Connecting...")
            } else if !viewModel.isConnected {
                Button(action: {
                    interactor?.connect()
                }, label: {
                    Text("入室")
                        .frame(maxWidth: 100, maxHeight: 64, alignment: .center)
                        .padding()
                        .font(.largeTitle)
                        .foregroundColor(Color.white)
                        .background(Color.green)
                })
            } else if viewModel.isConnected {
                Text("Waiting show question...")
            } else {
                Text("Hello1111")
            }
        }.onDisappear {
            viewModel.isConnected = false
        }
    }
}

extension MultiTestView: MultiTestDisplayLogic {
    private func status(model: MultiTestViewModel) {
        DispatchQueue.main.async {
            viewModel.isConnecting = model.isConnecting
            viewModel.isConnected = model.isConnected
            viewModel.isShowQuestion = model.isShowQuestion
            viewModel.isShowAnswer = model.isShowAnswer
        }
    }

    func onConnecting(model: MultiTestViewModel) {
        debugPrint("onConnecting view")

        status(model: model)
    }

    func onConnected(model: MultiTestViewModel) {
        debugPrint("onConnected view")

        status(model: model)
    }

    func onDisconnected(model: MultiTestViewModel) {
        status(model: model)
    }

    func showNext(model: MultiTestViewModel) {
        status(model: model)

        viewModel.question = model.question
    }

    func showAnswer(model: MultiTestViewModel) {
        status(model: model)
    }
}

extension MultiTestView {
    func configureView() -> some View {
        var view = self
        let interactor = MultiTestInteractor()
        let presenter = MultiTestPresenter()

        view.interactor = interactor
        interactor.presenter = presenter
        presenter.view = view

        return view
    }
}

struct MultiTestView_Previews: PreviewProvider {
    static var previews: some View {
        MultiTestView()
    }
}
