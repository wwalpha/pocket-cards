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
    let imgRect = CGRect(x: 0, y: 0, width: 400.0, height: 100.0)

    var body: some View {
        if !viewModel.isInitialized {
            Button(action: {
                interactor?.initialize()
            }, label: {
                Text("漢字練習開始")
                    .frame(maxWidth: 200, maxHeight: 48, alignment: .center)
                    .padding()
                    .foregroundColor(Color.white)
                    .background(Color.green)
            })

        } else {
            GeometryReader { geo in
                VStack {
                    HStack {
                        HStack {
                            Text("質問")
                                .frame(maxWidth: .infinity, alignment: .leading)
                                .font(.system(size: 36, design: .default))
                                .padding(.leading)
                        }

                        HStack {
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
                                let _ = canvasView.drawing.image(from: imgRect, scale: 1.0)
                            } label: {
                                Text("確 定")
                                    .padding()
                                    .frame(width: 120, height: 48, alignment: .center)
                                    .background(Color.green)
                                    .foregroundColor(Color.white)
                            }
                        }
                    }
                    .padding()
                    .frame(maxWidth: geo.size.width - 40, alignment: .trailing)
                    .frame(height: 96)
                    .border(Color.gray, width: 6)

                    HStack {
                        CanvasView(canvasView: self.$canvasView).padding(20.0).background(Color.gray)
                    }.padding()
                }.padding(.top, 16)
            }
        }
    }
}

extension HandwritingView: HandwritingDisplayLogic {
    func showNext(model: HandwritingViewModel) {
        DispatchQueue.main.async {
            viewModel.isInitialized = model.isInitialized
            viewModel.question = model.question
        }
    }

    func showError() {}
}

extension HandwritingView {
    func configureView() -> some View {
        var view = self
        let interactor = HandwritingInteractor(loadUrl: URLs.STUDY_DAILY_TEST, subject: SUBJECT.SOCIETY)
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
