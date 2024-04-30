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
        NavigationStack {
            VStack {
                if viewModel.isShowQuestion {
                    if viewModel.question?.choices != nil {
                        ChoiceQuestion(
                            question: viewModel.question!,
                            qCount: 10,
                            isShowError: "",
                            onChoice: interactor!.onChoice
                        )
                    } else if viewModel.question != nil {
                        // Society or Science
                        FlashCard(flipped: false, readOnly: true, hideButton: true, question: viewModel.question!, action: interactor!.onAction)
                    }
                } else if viewModel.isShowAnswer {
                    if viewModel.question?.choices != nil {
                        ChoiceQuestion(
                            question: viewModel.question!,
                            qCount: 10,
                            isShowError: viewModel.question!.answer,
                            onChoice: interactor!.onChoice
                        )
                    } else if viewModel.question != nil {
                        // Society or Science
                        FlashCard(flipped: true, readOnly: true, hideButton: true, question: viewModel.question!, action: interactor!.onAction)
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
                interactor?.disconnect()
            }
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
        debugPrint("showNext")

        status(model: model)

        viewModel.question = model.question
    }

    func showAnswer(model: MultiTestViewModel) {
        debugPrint("showAnswer")

        status(model: model)

        #if ReleaseDog
        guard let question = viewModel.question else { return }

        let uri = question.voiceAnswer ?? ""
        play(uri: uri)
        #endif
    }

    func play(uri: String) {
        debugPrint(uri)
        // download file if not exist
        let request = DownloadManager.default.downloadRequest(path: uri)

        Task {
            _ = await request?.serializingDownloadedFileURL().response

            // play audio
            Audio.play(url: FileManager.default.getFileUrl(fileName: uri))
        }
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
