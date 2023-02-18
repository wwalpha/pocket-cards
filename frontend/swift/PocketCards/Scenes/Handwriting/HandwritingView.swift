//
//  HandwritingView.swift
//  PocketCards
//
//  Created by macmini on 2022/10/06.
//
//

import PencilKit
import SwiftUI

struct HandwritingView: View {
    @State private var canvasView: PKCanvasView = .init()
    @ObservedObject var viewModel = HandwritingViewModel()
    var interactor: HandwritingBusinessLogic?

    var body: some View {
        if !viewModel.isInitialized {
            Text("Loading....")
                .onAppear {
                    interactor?.initialize()
                }
        } else {
            GeometryReader { geo in
                VStack {
                    HStack {
                        HStack {
                            let question = viewModel.question
                            let answer = viewModel.handwriting == "" ? question!.answer : "\(question!.answer)  【\(viewModel.handwriting)】"

                            Text(viewModel.isCorrect == true ? question!.title : answer)
                                .frame(maxWidth: .infinity, alignment: .leading)
                                .font(.system(size: 36, design: .default))
                                .padding(.leading)
                        }

                        HStack {
                            Button {
                                interactor?.next()
                            } label: {
                                Text("次へ")
                                    .padding()
                                    .frame(width: 96, height: 48, alignment: .center)
                                    .background(Color.red)
                                    .foregroundColor(Color.white)
                            }

                            Button {
                                canvasView.drawing = PKDrawing()
                            } label: {
                                Text("クリア")
                                    .padding()
                                    .frame(width: 120, height: 48, alignment: .center)
                                    .background(Color.red)
                                    .foregroundColor(Color.white)
                            }

                            Button {
                                // answer
                                let imgRect = CGRect(x: 0, y: 0, width: canvasView.frame.size.width, height: canvasView.frame.size.height)
                                let image = canvasView.drawing.image(from: imgRect, scale: 1.0)

                                interactor?.confirmAnswer(image: image)
                            } label: {
                                Text("確 定")
                                    .padding()
                                    .frame(width: 120, height: 48, alignment: .center)
                                    .background(viewModel.isLoading ? Color.gray : Color.green)
                                    .foregroundColor(Color.white)
                            }
                            .disabled(viewModel.isLoading)
                        }
                    }
                    .padding()
                    .frame(maxWidth: geo.size.width - 40, alignment: .trailing)
                    .frame(height: 96)
                    .border(Color.gray, width: 6)

//                    HStack {
//                        CanvasView(canvasView: self.$canvasView)
//                            .padding(10.0)
//                            .background(Color.gray)
//                    }.padding()
                }.padding(.top, 16)
            }.onDisappear {
                interactor?.destroy()
            }
        }
    }
}

extension HandwritingView: HandwritingDisplayLogic {
    func showLoading(model: HandwritingViewModel) {
        DispatchQueue.main.async {
            viewModel.isLoading = model.isLoading
        }
    }

    // 次の質問の表示
    func showNext(model: HandwritingViewModel) {
        DispatchQueue.main.async {
            viewModel.isInitialized = model.isInitialized
            viewModel.isLoading = model.isLoading
            viewModel.question = model.question
            viewModel.isCorrect = true
            canvasView.drawing = PKDrawing()
        }
    }

    // 回答表示
    func showError(result: String) {
        DispatchQueue.main.async {
            viewModel.isCorrect = false
            viewModel.handwriting = result
        }
    }
}

extension HandwritingView {
    func configureView() -> some View {
        var view = self
        let interactor = HandwritingInteractor(loadUrl: URLs.STUDY_DAILY_EXAM, subject: SUBJECT.HANDWRITING)
        let presenter = HandwritingPresenter()

        view.interactor = interactor
        interactor.presenter = presenter
        presenter.view = view

        return view
    }
}

struct HandwritingView_Previews: PreviewProvider {
    static var previews: some View {
        HandwritingView()
    }
}
